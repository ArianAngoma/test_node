import express, {Request, Response} from 'express';
import cors from 'cors';

import {loggerMiddleware} from './loggerMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use(loggerMiddleware);

interface INote {
  id: number,
  content: string,
  isImportant: boolean
}

let notes: INote[] = [
  {
    id: 1,
    content: 'Tengo que comer bien',
    isImportant: true,
  },
  {
    id: 2,
    content: 'Tengo que cocinar mi propia comida',
    isImportant: false,
  },
];

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req: Request, res: Response) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  const note = notes.find((note) => note.id === Number(id));

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/notes/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  notes = notes.filter((note) => note.id !== Number(id));
  res.status(204).json(notes);
});

app.post('/api/notes', (req: Request, res: Response) => {
  const note = req.body;

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note.content is missing',
    });
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const newNote: INote = {
    id: maxId + 1,
    content: note.content,
    isImportant: typeof note.isImportant !== 'undefined' ?
      note.isImportant :
      false,
  };

  notes = [...notes, newNote];

  res.status(201).json(newNote);
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
