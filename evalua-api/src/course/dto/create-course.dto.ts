import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  maxStudents: number;
}