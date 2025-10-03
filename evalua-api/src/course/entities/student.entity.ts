import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Course, course => course.students) // not including cascade strategies, cause as I explained in the controller, I opt for soft deletion
  @Index()
  course: Course;
}