import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxStudents?: number;
}