import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDTO, UserToProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(UsersProjectsEntity)
    private readonly userProjectRepository: Repository<UsersProjectsEntity>,
  ) {}

  public async createUser(body: UserDTO): Promise<UsersEntity> {
    try {
      console.log(process.env.HASH_SALT);
      const newPassword = await bcrypt.hash(
        body.password,
        +process.env.HASH_SALT,
      );

      console.log(newPassword);
      body.password = newPassword;
      return await this.userRepository.save(body);
    } catch (err) {
      throw new Error(err);
    }
  }

  public async relationToProject(body: UserToProjectDTO) {
    try {
      console.log(body);
      return await this.userProjectRepository.save(body);
    } catch (err) {
      throw ErrorManager.createSignatureError(err.message);
    }
  }

  public async findUsers(): Promise<UsersEntity[]> {
    try {
      const users: UsersEntity[] = await this.userRepository.find();
      if (users.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No users found',
        });
      }

      return users;
    } catch (err) {
      throw new ErrorManager.createSignatureError(err.message);
    }
  }

  public async findUserById(id: string): Promise<UsersEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .leftJoinAndSelect('user.projectsIncludes', 'projectsIncludes')
        .leftJoinAndSelect('projectsIncludes.project', 'project')
        .getOne();
    } catch (err) {
      throw new Error(err);
    }
  }

  public async updateUser(
    body: UserUpdateDTO,
    id: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const user: UpdateResult = await this.userRepository.update(id, body);
      if (user.affected === 0) {
        return undefined;
      }

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async findBy({ key, value }: { key: keyof UserDTO; value: any }) {
    try {
      const user: UsersEntity = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne();

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult | undefined> {
    try {
      const user: DeleteResult = await this.userRepository.delete(id);
      if (user.affected === 0) {
        return undefined;
      }

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}
