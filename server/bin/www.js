#!/usr/bin/env node

import http from 'http';
import express from 'express';
import { initApp as init } from '../src/http/app.js';
import expressWs from 'express-ws';
import debugLib from 'debug';

// Utilisation du module debug
const debug = debugLib('server:server');

// Initialisation de l'application Express
const app = express();

// Normalisation du port
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

// Création du serveur HTTP
const server = http.createServer(app);

// Initialisation de express-ws avec l'application Express et le serveur HTTP
const expressWsInstance = expressWs(app, server);
console.log('Express WebSocket instance initialized');

// Écoute du serveur sur le port spécifié
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalise le port en un nombre, une chaîne ou faux.
 * @param {string} val 
 * @returns {number|string|boolean} 
 */
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

/**
 * Gestionnaire d'événements pour l'erreur du serveur HTTP.
 * @param {object} error 
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Gestionnaire d'événements pour l'événement "listening" du serveur HTTP.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
  console.info(`Server is running on port ${addr.port}`);
}

// Initialisation de l'application
init(app, expressWsInstance.getWss());
