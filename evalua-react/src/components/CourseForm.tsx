import { useState } from 'react';
import type { CreateCourseDto, UpdateCourseDto, Course } from '../types';

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CreateCourseDto | UpdateCourseDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CourseForm({ course, onSubmit, onCancel, isLoading }: CourseFormProps) {
  const [formData, setFormData] = useState<CreateCourseDto>({
    name: course?.name || '',
    description: course?.description || '',
    maxStudents: course?.maxStudents || 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-kokushoku mb-1">
          Course Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-shironezu focus:ring-2 focus:ring-asagiiro focus:border-transparent bg-gofuniro text-kokushoku"
          placeholder="Enter course name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-kokushoku mb-1">
          Description
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-shironezu focus:ring-2 focus:ring-asagiiro focus:border-transparent bg-gofuniro text-kokushoku"
          placeholder="Enter course description"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="maxStudents" className="block text-sm font-medium text-kokushoku mb-1">
          Max Students
        </label>
        <input
          id="maxStudents"
          type="number"
          required
          min="1"
          value={formData.maxStudents}
          onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-shironezu focus:ring-2 focus:ring-asagiiro focus:border-transparent bg-gofuniro text-kokushoku"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-benihi text-gofuniro py-2 px-4 hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-shironeri text-aisumicha py-2 px-4 hover:brightness-95 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
