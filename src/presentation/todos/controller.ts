import { error } from 'console';
import { Request, Response } from 'express';

const todos = [
  { id: 1, text: 'Buy milk', completedAt: new Date() },
  { id: 2, text: 'Buy rice', completedAt: null },
  { id: 3, text: 'Buy juice', completedAt: new Date() },
];

export class TodosController {
  //* Inducción de dependencias
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoByID = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' });

    const todo = todos.find((todo) => todo.id === id);

    todo
      ? res.status(200).json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not fund` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ error: 'Text property is required' });

    const newTodo = {
      id: todos.length + 1,
      text,
      completedAt: null,
    };
    todos.push(newTodo);

    return res.json(todos);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' });

    const todo = todos.find((todo) => todo.id === id);

    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    const { text, completedAt } = req.body;

    todo.text = text || todo.text;
    completedAt === null
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));

    return res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' });

    const todo = todos.find((todo) => todo.id === id);

    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    todos.splice(todos.indexOf(todo), 1);

    return res.json(todo);
  };
}
