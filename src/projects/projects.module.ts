import { Module } from '@nestjs/common';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controller/projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEntity } from './entities/projects.entity';
('src/users/services/users.service');

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsEntity])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
