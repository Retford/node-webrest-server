import { CreateTodoDto } from '../dtos/todos/create-todo.dto';
import { TodoEntity } from '../entities/todo.entity';
import { UpdateTodoDto } from '../dtos/todos/update-todo.dto';

export abstract class TodoDatasource {
  abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;

  // Todo: paginación
  abstract getAll(): Promise<TodoEntity[]>;

  abstract findByID(id: number): Promise<TodoEntity>;
  abstract updateByID(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
  abstract deleteByID(id: number): Promise<TodoEntity>;
}
