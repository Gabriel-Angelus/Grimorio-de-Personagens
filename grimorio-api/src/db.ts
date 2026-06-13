import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '..', 'data.db');
const db = new Database(dbPath);

// Ativa as foreign keys no SQLite (por padrão vêm desativadas)
db.pragma('foreign_keys = ON');

// Criação das tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS campanhas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    criadaEm TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS personagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    classe TEXT NOT NULL,
    raca TEXT NOT NULL,
    origem TEXT NOT NULL,
    nivel INTEGER NOT NULL,
    forca INTEGER NOT NULL,
    destreza INTEGER NOT NULL,
    constituicao INTEGER NOT NULL,
    inteligencia INTEGER NOT NULL,
    sabedoria INTEGER NOT NULL,
    carisma INTEGER NOT NULL,
    campanhaId INTEGER,
    criadoEm TEXT NOT NULL,
    FOREIGN KEY (campanhaId) REFERENCES campanhas (id) ON DELETE SET NULL
  );
`);

export default db;
