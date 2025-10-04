import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateCourseDto } from './dto/update-course.dto'
import { Course } from './entities/course.entity';
import { Student } from './entities/student.entity';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course) private courseRepository: Repository<Course>,
        @InjectRepository(Student) private studentRepository: Repository<Student>
    ) {}

    private domainDiversityCache?: { value: Array<number>; expiresAt: number };

    private invalidateDomainDiversityCache() {
        this.domainDiversityCache = undefined;
    }

    async createCourse(dto: CreateCourseDto) {
        try {
            await this.getActiveCourse()
            throw new BadRequestException('Course already exists')
        } catch (error) {
            if (error instanceof NotFoundException) {
                const course = this.courseRepository.create(dto)
                const saved = await this.courseRepository.save(course)
                this.invalidateDomainDiversityCache()
                return saved
            }
            throw error
        }
    }

    async getActiveCourse() {
        const course = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.students', 'student', 'student.active = :active', { active: true })
            .where('course.active = :active', { active: true })
            .getOne();
        if (!course) {
            throw new NotFoundException('Course not found')
        }
        return course
    }

    async courseIndex() {
        const course = await this.getActiveCourse()
        const now = Date.now()
        
        if (this.domainDiversityCache && this.domainDiversityCache.expiresAt > now) {
            const [domainDiversity, emailDomainsCount, studentsCount] = this.domainDiversityCache.value;
            return {
                course,
                domainDiversity: (domainDiversity * 100) + '%',
                emailDomainsCount,
                studentsCount
            };
        }
        
        const [domainDiversity, emailDomainsCount, studentsCount] = await this.calculateDomainDiversity();
        this.domainDiversityCache = { 
            value: [domainDiversity, emailDomainsCount, studentsCount], 
            expiresAt: now + 12 * 60 * 60 * 1000 
        };
        
        return {
            course,
            domainDiversity: (domainDiversity * 100) + '%',
            emailDomainsCount,
            studentsCount
        };
    }

    async calculateDomainDiversity() {
        const activeStudents = await this.getStudents()
        const studentsCount = activeStudents.length
        if (studentsCount === 0) {
            return [0, 0, 0]
        }

        const emailDomainsCount = Array.from(
                new Set(activeStudents.map(student => student.email.split('@')[1]))
            ).length
        return [Number((emailDomainsCount / studentsCount).toFixed(2)), emailDomainsCount, studentsCount]
    }

    async updateCourse(dto: UpdateCourseDto) {
        const course = await this.getActiveCourse()
        Object.assign(course, dto)
        const saved = await this.courseRepository.save(course)
        return saved
    }

    async deleteCourse() {
        const course = await this.getActiveCourse()
        course.active = false // I personally prefer soft deletion over actual deletion, for both data integrity and compliance
        const saved = await this.courseRepository.save(course)
        this.invalidateDomainDiversityCache()
        return saved
    }

    async addStudent(dto: CreateStudentDto) {
        const course = await this.getActiveCourse()
        const activeStudents = await this.getStudents()
        const student = this.studentRepository.create({
            ...dto,
            course
        })
        if (activeStudents.length >= course.maxStudents) {
            throw new BadRequestException('Course is full')
        }
        course.students.push(student)
        const saved = await this.studentRepository.save(student)
        this.invalidateDomainDiversityCache()
        return saved
    }

    async getStudents() {
        const course = await this.getActiveCourse()
        return course.students.filter(student => student.active)
    }

    async deleteStudent(id: string) {
        const students = await this.getStudents()
        const student = students.find(student => student.id === id)
        if (!student) {
            throw new NotFoundException('Student not found')
        }
        student.active = false // Same here for the soft deletion
        const saved = await this.studentRepository.save(student)
        this.invalidateDomainDiversityCache()
        return saved
    }
}
