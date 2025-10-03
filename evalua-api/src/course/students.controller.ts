import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { CourseService } from './course.service';

@Controller('course/students')
export class StudentsController {

    constructor(private readonly courseService: CourseService) {}

    @Post()
    addStudent(@Body() dto: CreateStudentDto) {
        return this.courseService.addStudent(dto)
    }

    @Get()
    listStudents() {
        return this.courseService.getStudents()
    }

    @Delete()
    deleteStudent(@Param('id') id: string) {
        return this.courseService.deleteStudent(id)
    }
}
