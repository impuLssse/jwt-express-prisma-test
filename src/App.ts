import { register } from 'tsconfig-paths';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
register();

import * as express from 'express';
export const app = express();

import { errorMiddleware } from '@middlewares';
import { authRouter, taskRouter } from '@routers';
import { AppConfig } from '@Config';
import { userRouter } from '@routers/user';

export const prisma = new PrismaClient();

async function bootstrapApp() {
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.json());

  await prisma.$connect();

  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/task', taskRouter);
  app.use(errorMiddleware);

  app.listen(AppConfig.APP_PORT, () => {
    console.log(`SERVER STARTED ON PORT ${AppConfig.APP_PORT}`);
  });
}

bootstrapApp();
