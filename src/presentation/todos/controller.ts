import { Request, Response } from 'express';
// import { prisma } from '../../data/postgres';
import { prisma } from '../../data/postgres/index';
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo.dto';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto';

export class TodosController {
  //* Inducción de dependencias
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    return res.json(todos);
  };

  public getTodoByID = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' });

    const todo = await prisma.todo.findFirst({ where: { id } });

    todo
      ? res.status(200).json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });

    return res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.findFirst({ where: { id } });

    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    const updatedTodo = await prisma.todo.update({
      data: updateTodoDto!.values,
      where: { id },
    });

    return res.json(updatedTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' });

    const todo = await prisma.todo.findFirst({ where: { id } });

    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    const deletedTodo = await prisma.todo.delete({ where: { id } });

    deletedTodo
      ? res.json(deletedTodo)
      : res.status(404).json({ error: `Todo with id ${id} not found` });
  };
}
