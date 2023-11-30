import { prisma } from '@App';
import { ApiError } from '@errors';
import { Prisma, User as PrismaUser } from '@prisma/client';
import { authService } from '@services/auth';
import { User } from 'libs/interfaces';

export class UserService {
  async findUser(where: Prisma.UserWhereUniqueInput): Promise<PrismaUser> {
    return prisma.user.findUnique({ where });
  }

  async createUser(user: User) {
    const { user_name, password } = user;

    const candidate = await this.findUser({ user_name });
    if (candidate) {
      throw ApiError.badRequest([`User with nickname ${user_name} already exist`]);
    }

    const hashed_password = await authService.hashPassword(password, 3);

    return prisma.user.create({
      data: {
        user_name: user.user_name,
        hashed_password,
      },
    });
  }

  async findUsers() {
    return prisma.user.findMany();
  }
}

export const userService = new UserService();
