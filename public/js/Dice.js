//three tutorial from: https://www.youtube.com/watch?v=PPwR7h5SnOE&ab_channel=SimonDev
//cannon-es tutorial from: https://tympanus.net/codrops/2023/01/25/crafting-a-dice-roller-with-three-js-and-cannon-es/
//dice wrap: https://www.pngwing.com/en/free-png-ycgvk

import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';

const numDice = 5;
const dieSize = 4;	//independent from number of sides, but physical size of the dice
const setHeight = 500;
let container = document.getElementById("player");

const scene = new THREE.Scene();

const fov = 60;
const aspect = 1920 / setHeight;
const near = 1.0;
const far = 1000.0;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 20, 50);

const renderer = new THREE.WebGLRenderer({antialias:true});

let physicsWorld;

let Dice = [];
let roll = [];

window.addEventListener('DOMContentLoaded', async () => {
	initialize();
});

function initialize() {
	let light = new THREE.AmbientLight(0xFFFFFF);
	scene.add(light);
	scene.background = new THREE.Color(0xFFFFFF);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio(container.devicePixelRatio);
	renderer.setSize(container.scrollWidth, setHeight);
	document.body.appendChild(renderer.domElement);

	physicsWorld = new CANNON.World({gravity: new CANNON.Vec3(0, -50, 0), allowSleep: true});
	physicsWorld.defaultContactMaterial.restitution = 0.3;

	window.addEventListener('resize', () => {
		WindowResize();
	}, false);

	setRollBox();
	for(let i = 0; i<numDice; i++){
		Dice.push(makeDie(i));
		waitGetRoll(i);
	}
	document.getElementById("reroll").onclick = rollDice;
	rollDice();

	render();
}
function WindowResize() {
	camera.aspect = container.scrollWidth / setHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.scrollWidth, setHeight);
}

function setRollBox() {
	//container box
	const ground = new THREE.Mesh(
		new THREE.PlaneGeometry(150, 30),
		new THREE.MeshStandardMaterial({color: 0x404040}));
	ground.castShadow = false;
	ground.receiveShadow = true;
	ground.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
	scene.add(ground);
	const groundBody = new CANNON.Body({
		type: CANNON.Body.STATIC,
		shape: new CANNON.Plane(),
	});
	groundBody.position.copy(ground.position);
	groundBody.quaternion.copy(ground.quaternion);
	physicsWorld.addBody(groundBody);

	const leftWall = new THREE.Mesh(
		new THREE.PlaneGeometry(30, 40),
		new THREE.MeshStandardMaterial().transparent = true);
	leftWall.position.set(-35, 20, 0);
	leftWall.castShadow = false;
	leftWall.receiveShadow = true;
	leftWall.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * .5);
	scene.add(leftWall);
	const leftWallBody = new CANNON.Body({
		type: CANNON.Body.STATIC,
		shape: new CANNON.Plane(),
	});
	leftWallBody.position.copy(leftWall.position);
	leftWallBody.quaternion.copy(leftWall.quaternion);
	physicsWorld.addBody(leftWallBody);

	const rightWall = new THREE.Mesh(
		new THREE.PlaneGeometry(30, 40),
		new THREE.MeshStandardMaterial().transparent = true);
	rightWall.position.set(35, 20, 0);
	rightWall.castShadow = false;
	rightWall.receiveShadow = true;
	rightWall.quaternion.setFromAxisAngle(new THREE.Vector3(0, -1, 0), Math.PI * .5);
	scene.add(rightWall);
	const rightWallBody = new CANNON.Body({
		type: CANNON.Body.STATIC,
		shape: new CANNON.Plane(),
	});
	rightWallBody.position.copy(rightWall.position);
	rightWallBody.quaternion.copy(rightWall.quaternion);
	physicsWorld.addBody(rightWallBody);

	const backWall = new THREE.Mesh(
		new THREE.PlaneGeometry(40, 70),
		new THREE.MeshStandardMaterial().transparent = true);
	backWall.position.set(0, 20, -15);
	backWall.castShadow = false;
	backWall.receiveShadow = true;
	backWall.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * .5);
	scene.add(backWall);
	const backWallBody = new CANNON.Body({
		type: CANNON.Body.STATIC,
		shape: new CANNON.Plane(),
	});
	backWallBody.position.copy(backWall.position);
	backWallBody.quaternion.copy(backWall.quaternion);
	physicsWorld.addBody(backWallBody);

	// const frontWall = new THREE.Mesh(
	// 	new THREE.PlaneGeometry(40, 70),
	// 	new THREE.MeshStandardMaterial().transparent = true);
	// frontWall.position.set(0, 20, 15);
	// frontWall.castShadow = false;
	// frontWall.receiveShadow = true;
	// frontWall.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, -1), Math.PI * .5);
	// scene.add(frontWall);
	// const frontWallBody = new CANNON.Body({
	// 	type: CANNON.Body.STATIC,
	// 	shape: new CANNON.Plane(),
	// });
	// frontWallBody.position.copy(frontWall.position);
	// frontWallBody.quaternion.copy(frontWall.quaternion);
	// physicsWorld.addBody(frontWallBody);
}

function makeDie(i){
	const loader2 = new THREE.TextureLoader();
	const dieFaces = [
		new THREE.MeshStandardMaterial({map: loader2.load("./resources/1.png")}),
		new THREE.MeshStandardMaterial({map: loader2.load("./resources/6.png")}),
		new THREE.MeshStandardMaterial({map: loader2.load("./resources/2.png")}),
		new THREE.MeshStandardMaterial({map: loader2.load("./resources/5.png")}),
		new THREE.MeshStandardMaterial({map: loader2.load("./resources/3.png")}),
		new THREE.MeshStandardMaterial({map: loader2.load("./resources/4.png")})
	]

	const mesh = new THREE.Mesh(new THREE.BoxGeometry(dieSize, dieSize, dieSize), dieFaces);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);

	// phys die
	const body = new CANNON.Body({
		mass: 1, shape: new CANNON.Box(new CANNON.Vec3(dieSize/2, dieSize/2, dieSize/2)), sleepTimeLimit: 0.1
	});
	body.position = new CANNON.Vec3(0, 10+(5*i), 0);
	mesh.position.copy(body.position);
	physicsWorld.addBody(body);

	return {mesh, body};
}

function waitGetRoll(i) {
	let die = Dice[i];
	die.body.addEventListener('sleep', (e) => {
		die.body.allowSleep = false;
		const euler = new CANNON.Vec3();
		die.body.quaternion.toEuler(euler);
		let acceptance = 0.1;

		if(Math.abs(euler.z)<acceptance){
			if(Math.abs(euler.x)<acceptance){
				roll[i] = 2;
				checkRolls();
			}else if(Math.abs((euler.x)-(Math.PI/2))<acceptance){
				roll[i] = 4;
				checkRolls();
			}else if(Math.abs((euler.x)+(Math.PI/2))<acceptance){
				roll[i] = 3;
				checkRolls();
			}else if(Math.abs((euler.x)-Math.PI)<acceptance || Math.abs(euler.x+Math.PI)<acceptance){
				roll[i] = 5;
				checkRolls();
			}else{
				die.body.allowSleep = true;
			}
		}else if(Math.abs(euler.z-(Math.PI/2))<acceptance){
			roll[i] = 1;
			checkRolls();
		}else if(Math.abs(euler.z+(Math.PI/2))<acceptance){
			roll[i] = 6;
			checkRolls();
		}else{
			die.body.allowSleep = true;
		}
	});
}

function checkRolls(){
	for(let i = 0; i<numDice; i++){
		if(roll[i]===0){return}
	}
	document.getElementById("reroll").disabled = true;
	//TODO send Dice
	console.log(roll);
}

function rollDice(){
	roll[numDice-1] = 0;
	roll.fill(0, 0, numDice)

	for(let i = 0; i<numDice; i++){
		Dice[i].body.position = new CANNON.Vec3(0, 10+(5*i), 0);
		Dice[i].mesh.position.copy(Dice[i].body.position);
		Dice[i].mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
		Dice[i].body.quaternion.copy(Dice[i].mesh.quaternion);
		Dice[i].body.applyImpulse(
			new CANNON.Vec3(0,0,0),
			new CANNON.Vec3(0,0,0)
		);
		Dice[i].body.allowSleep = true;
	}
}

function render() {
	physicsWorld.fixedStep();

	for (const dice of Dice) {
		dice.mesh.position.copy(dice.body.position)
		dice.mesh.quaternion.copy(dice.body.quaternion)
	}

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}