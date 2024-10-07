import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import searchRouter from './routes/search.js';

// Initialisation de Prisma
const prisma = new PrismaClient();

// Récupère le chemin du répertoire actuel dans les modules ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function initApp(app) {
  // Configuration de base de l'application
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors());

  // Routes de l'application
  app.get('/api', (req, res) => {
    res.json("Ok");
  });

  app.use('/api/search', searchRouter);


  // Gestion des erreurs 404
  app.use((req, res, next) => {
    res.status(404).json("Endpoint Not Found");
  });

  // Gestionnaire d'erreurs global
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).json("error");
  });
}

export { initApp, prisma };
