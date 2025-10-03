import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  maxStudents: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Student, student => student.course)// not including cascade strategies, cause as I explained in the controller, I opt for soft deletion
  students: Student[];
}