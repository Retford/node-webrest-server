import { Request, Response } from 'express';
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo.dto';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto';
import { TodoRepository } from '../../domain/repositories/todo.repository';
import { GetTodos } from '../../domain/use-cases/todo/get-todos';
import { GetTodoByID } from '../../domain/use-cases/todo/get-todo-by-id';
import { CreateTodo } from '../../domain/use-cases/todo/create-todo';
import { UpdateTodo } from '../../domain/use-cases/todo/update-todo';
import { DeleteTodo } from '../../domain/use-cases/todo/delete-todo';
import { CustomError } from '../../domain/errors/custom.error';

export class TodosController {
  //* Inducción de dependencias
  constructor(private readonly todoRepository: TodoRepository) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    // grabar logs
    res.status(500).json({ error: 'Internal server error - check logs' });
  };

  public getTodos = (req: Request, res: Response) => {
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => this.handleError(res, error));
  };

  public getTodoByID = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    new GetTodoByID(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public createTodo = (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) return res.status(400).json({ error });

    new CreateTodo(this.todoRepository)
      .execute(createTodoDto!)
      .then((todo) => res.status(201).json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });

    if (error) return res.status(400).json({ error });

    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDto!)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);

    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };
}
