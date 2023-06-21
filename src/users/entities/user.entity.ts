import { Column, Entity, OneToMany } from 'typeorm';
import { IUser } from '../../interfaces/users.interface';
import { BaseEntity } from '../../config/base.entity';
import { ROLES } from '../../constants/roles';
import { UsersProjectsEntity } from './usersProjects.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity implements IUser {
  @Column({ name: 'firstName' })
  firstName: string;

  @Column({ name: 'lastName' })
  lastName: string;

  @Column()
  age: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @OneToMany(() => UsersProjectsEntity, (usersProjects) => usersProjects.user)
  projectsIncludes: UsersProjectsEntity[];
}
