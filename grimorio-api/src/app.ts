import cors from 'cors';
import express from 'express';
import campanhasRouter from './routes/campanhas.js';
import personagensRouter from './routes/personagens.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/campanhas', campanhasRouter);
app.use('/personagens', personagensRouter);

app.get('/', (req, res) => {
  res.json({
    api: 'Grimorio API',
    versao: '1.0.0',
    rotas: ['/campanhas', '/personagens'],
  });
});

app.use(errorHandler);

export default app;
