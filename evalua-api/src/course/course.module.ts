import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Student } from './entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Student])],
  providers: [CourseService],
  controllers: [CourseController, StudentsController]
})
export class CourseModule {}
