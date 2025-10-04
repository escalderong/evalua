import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onDeleteStudent: (id: string) => void;
  isDeleting?: string;
}

export function StudentList({ students, onDeleteStudent, isDeleting }: StudentListProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-aisumicha">
        No students enrolled yet
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto border border-shironezu">
      <div className="divide-y divide-shironezu">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-4 hover:bg-shironeri transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-medium text-kokushoku">{student.name}</h4>
              <p className="text-sm text-aisumicha">{student.email}</p>
            </div>
            <button
              onClick={() => onDeleteStudent(student.id)}
              disabled={isDeleting === student.id}
              className="ml-4 text-benihi hover:brightness-90 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              {isDeleting === student.id ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
