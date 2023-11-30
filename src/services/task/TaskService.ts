import { prisma } from '@App';
import { Task } from '@prisma/client';

class TaskService {
  async getTasks(): Promise<Task[]> {
    return prisma.task.findMany();
  }

  async getTask(task_id: string): Promise<Task> {
    return prisma.task.findUnique({
      where: {
        id: task_id,
      },
    });
  }
}

export const taskService = new TaskService();
