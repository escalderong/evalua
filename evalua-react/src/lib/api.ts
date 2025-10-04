import axios from 'axios';
import type {
  Course,
  CourseIndexResponse,
  CreateCourseDto,
  UpdateCourseDto,
  CreateStudentDto,
  Student,
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const courseApi = {
  getCourse: async (): Promise<CourseIndexResponse> => {
    const { data } = await api.get<CourseIndexResponse>('/course');
    return data;
  },

  createCourse: async (dto: CreateCourseDto): Promise<Course> => {
    const { data } = await api.post<Course>('/course', dto);
    return data;
  },

  updateCourse: async (dto: UpdateCourseDto): Promise<Course> => {
    const { data } = await api.patch<Course>('/course', dto);
    return data;
  },

  deleteCourse: async (): Promise<Course> => {
    const { data } = await api.delete<Course>('/course');
    return data;
  },

  getStudents: async (): Promise<Student[]> => {
    const { data } = await api.get<Student[]>('/course/students');
    return data;
  },

  addStudent: async (dto: CreateStudentDto): Promise<Student> => {
    const { data } = await api.post<Student>('/course/students', dto);
    return data;
  },

  deleteStudent: async (id: string): Promise<Student> => {
    const { data } = await api.delete<Student>(`/course/students/${id}`);
    return data;
  },
};
