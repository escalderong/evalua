export interface Student {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  maxStudents: number;
  active: boolean;
  students: Student[];
}

export interface CourseIndexResponse {
  course: Course;
  domainDiversity: string;
  emailDomainsCount: number;
  studentsCount: number;
}

export interface CreateCourseDto {
  name: string;
  description: string;
  maxStudents: number;
}

export interface UpdateCourseDto {
  name?: string;
  description?: string;
  maxStudents?: number;
}

export interface CreateStudentDto {
  name: string;
  email: string;
}
