import { app } from '@App';
import { Request, Response } from 'express';

app.get('/', (req: Request, res: Response) => {
  return res.json('meow !');
});
