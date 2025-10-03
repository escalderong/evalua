import { Controller, Delete, Get, Patch, Post, Body, Param } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { CourseService } from './course.service.js';

@Controller('course')
export class CourseController {

    constructor(private readonly courseService: CourseService) {}

    @Post()
    createCourse(@Body() dto: CreateCourseDto) {
        return this.courseService.createCourse(dto)
    }

    @Get()
    courseIndex() {
        return this.courseService.courseIndex()
    }

    @Patch()
    updateCourse(@Body() dto: UpdateCourseDto) {
        return this.courseService.updateCourse(dto)
    }

    @Delete()
    deleteCourse() {
        return this.courseService.deleteCourse()
    }
}
