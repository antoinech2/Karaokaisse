import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import moment from 'moment-timezone'; // Importer moment-timezone

// Résoudre le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Générer un nom de fichier unique avec un timestamp
const logFileName = `log-${new Date().toISOString().replace(/:/g, '-')}.log`;

// Vérifier si le dossier logs existe, sinon le créer
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir); // Créer le dossier 'logs' s'il n'existe pas
}

// Format personnalisé du timestamp avec le fuseau horaire
const timestampWithTimezone = () => moment().tz('Europe/Paris').format('DD/MM/YYYY HH:mm:ss');

// Définir un format personnalisé pour les logs
const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Créer le logger Winston
const logger = winston.createLogger({
  level: 'silly', // Niveau minimum de log
  format: winston.format.combine(
    winston.format.timestamp({ format: timestampWithTimezone }),  // Utiliser le timestamp avec fuseau horaire
    myFormat                                                      // Utiliser le format personnalisé
  ),
  transports: [
    // Transport pour afficher les logs dans la console avec couleurs
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),   // Colorise les niveaux de logs (utile pour la console)
        myFormat                      // Utilise le même format personnalisé
      )
    }),
    // Transport pour écrire les logs dans un fichier unique à chaque exécution
    new winston.transports.File({
      filename: path.join(logsDir, logFileName) // Chemin du fichier unique
    })
  ]
});

export default logger;
