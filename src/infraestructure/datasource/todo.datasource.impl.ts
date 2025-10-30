import { prisma } from '../../data/postgres';
import { TodoDatasource } from '../../domain/datasources/todo.datasource';
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo.dto';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto';
import { TodoEntity } from '../../domain/entities/todo.entity';
import { CustomError } from '../../domain/errors/custom.error';

export class TodoDatasourceImpl implements TodoDatasource {
  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await prisma.todo.create({ data: createTodoDto });

    return TodoEntity.fromObject(todo);
  }
  async getAll(): Promise<TodoEntity[]> {
    const todos = await prisma.todo.findMany();

    return todos.map((todo) => TodoEntity.fromObject(todo));
  }
  async findByID(id: number): Promise<TodoEntity> {
    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo) throw new CustomError(`Todo with id ${id} not found`, 404);

    return TodoEntity.fromObject(todo);
  }
  async updateByID(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    await this.findByID(updateTodoDto.id);

    const updatedTodo = await prisma.todo.update({
      where: { id: updateTodoDto.id },
      data: updateTodoDto.values,
    });

    return TodoEntity.fromObject(updatedTodo);
  }
  async deleteByID(id: number): Promise<TodoEntity> {
    await this.findByID(id);
    const deleted = await prisma.todo.delete({
      where: { id },
    });

    return TodoEntity.fromObject(deleted);
  }
}
