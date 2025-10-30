import { Request, Response } from 'express';
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo.dto';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto';
import { TodoRepository } from '../../domain/repositories/todo.repository';

export class TodosController {
  //* Inducción de dependencias
  constructor(private readonly todoRepository: TodoRepository) {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll();
    return res.json(todos);
  };

  public getTodoByID = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const todo = await this.todoRepository.findByID(id);
      console.log(todo);

      return res.json(todo);
    } catch (error) {
      res.status(400).json({ error });
    }
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) return res.status(400).json({ error });

    const todo = await this.todoRepository.create(createTodoDto!);

    return res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });

    if (error) return res.status(400).json({ error });

    try {
      const updatedTodo = await this.todoRepository.updateByID(updateTodoDto!);

      return res.json(updatedTodo);
    } catch (error) {
      res.status(400).json({ error });
    }
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const deletedTodo = await this.todoRepository.deleteByID(id);
      return res.json(deletedTodo);
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}
