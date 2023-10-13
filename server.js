import express from 'express';
import cors from 'cors';

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.static('public')); 

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (request, response) => {
    const dir = 'public/'
    const filename = dir + request.url.slice( 1 ) 
  
    if( request.url === '/' ) {
      sendFile( response, 'public/index.html' )
    } else if (request.url === '/results') { 
      //send appdata
    }
    else {
      sendFile( response, filename )
    }
});

import mime from 'mime';
import http from 'http';
import fs from 'fs';

const sendFile = function( response, filename ) {
    const type = mime.getType( filename ) 
 
    fs.readFile( filename, function( err, content ) {
 
      // if the error = null, then we've loaded the file successfully
      if( err === null ) {
 
        // status code: https://httpstatuses.com
        response.writeHeader( 200, { 'Content-Type': type })
        response.end( content )
 
      }else{
 
        // file not found, error code 404
        response.writeHeader( 404 )
        response.end( '404 Error: File Not Found' )
 
      }
    })
 }

 import router from './app/routes/game.routes.js'
 app.use('/', router);
 

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});