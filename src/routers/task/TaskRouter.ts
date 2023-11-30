import { AuthMiddleware, ValidationMiddleware } from '@middlewares';
import { Router } from 'express';
import { body, param } from 'express-validator';
import { taskService } from '@services/task';

export const taskRouter = Router();

taskRouter.get(
  '/:task_id',
  AuthMiddleware,
  param('task_id').isUUID(),
  ValidationMiddleware,
  (req, res) => {
    console.log(req.params);
    res.json(123);
  },
);

taskRouter.get('/', AuthMiddleware, async (req, res) => {
  const found_tasks = await taskService.getTasks();
  return res.json(found_tasks);
});

taskRouter.post(
  '/',
  AuthMiddleware,
  body('task_name').isString(),
  body('task_description').isString(),
  ValidationMiddleware,
  async (req, res, next) => {
    try {
      console.log('task here');
      return next();
    } catch (e) {
      next(e);
    }
  },
);
