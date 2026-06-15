import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.npm_lifecycle_event === 'test';

const dbPath = isTestEnvironment ? ':memory:' : path.resolve(__dirname, '..', 'data.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

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
    descricao TEXT,
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

const colunasPersonagens = db
  .prepare('PRAGMA table_info(personagens)')
  .all() as Array<{ name: string }>;
const possuiDescricao = colunasPersonagens.some((coluna) => coluna.name === 'descricao');

if (!possuiDescricao) {
  db.exec('ALTER TABLE personagens ADD COLUMN descricao TEXT');
}

export default db;
