import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '../lib/api';
import { CourseForm } from '../components/CourseForm';
import { StudentList } from '../components/StudentList';
import { AddStudentForm } from '../components/AddStudentForm';
import { Modal } from '../components/Modal';
import { DomainDiversityGauge } from '../components/DomainDiversityGauge';
import type { AxiosError } from 'axios';
import type { CreateCourseDto, UpdateCourseDto, CreateStudentDto, Student } from '../types';

function getApiErrorMessage(err: unknown): string {
  const ax = err as AxiosError<any> | undefined;
  const data = ax?.response?.data;
  const statusText = ax?.response?.statusText;
  const fallback = (ax?.message || statusText || 'Request failed').toString();

  if (!data) return fallback;
  const msg = (data as any).message ?? (data as any).error ?? data;
  if (Array.isArray(msg)) return msg.join(', ');
  if (typeof msg === 'string') return msg;
  try {
    return JSON.stringify(msg);
  } catch {
    return fallback;
  }
}

export function CoursePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | undefined>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['course'],
    queryFn: courseApi.getCourse,
    retry: false,
  });

  const domainDetails = data ? {
    uniqueDomains: data.emailDomainsCount,
    totalStudents: data.studentsCount
  } : null;

  const createCourseMutation = useMutation({
    mutationFn: (dto: CreateCourseDto) => courseApi.createCourse(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setShowCreateForm(false);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (dto: UpdateCourseDto) => courseApi.updateCourse(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setIsEditing(false);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: () => courseApi.deleteCourse(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });

  const addStudentMutation = useMutation({
    mutationFn: (dto: CreateStudentDto) => courseApi.addStudent(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setIsAddModalOpen(false);
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => courseApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setDeletingStudentId(undefined);
    },
  });

  const handleDeleteStudent = (id: string) => {
    setDeletingStudentId(id);
    deleteStudentMutation.mutate(id);
  };

  const handleDeleteCourse = () => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteCourseMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hakuji text-kokushoku flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const courseNotFound = error?.response?.status === 404;

  return (
    <div className="min-h-screen bg-hakuji text-kokushoku py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gofuniro shadow p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Evalua
          </h1>

          {courseNotFound || !data ? (
            <div className="text-center">
              {!showCreateForm ? (
                <div className="py-12">
                  <p className="text-aisumicha mb-6">No hay curso aún</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-asagiiro text-gofuniro px-8 py-3 hover:brightness-90 transition-colors font-medium"
                  >
                    Crear nuevo curso
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <h2 className="text-xl font-semibold mb-4">Crear nuevo curso</h2>
                  <CourseForm
                    onSubmit={(data) => createCourseMutation.mutate(data as CreateCourseDto)}
                    onCancel={() => setShowCreateForm(false)}
                    isLoading={createCourseMutation.isPending}
                  />
                  {createCourseMutation.isError && (
                    <p className="mt-4 text-benihi text-sm" role="alert">
                      {getApiErrorMessage(createCourseMutation.error)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {!isEditing ? (
                <div>
                  <div className="bg-kon text-gofuniro p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-2">{data.course.name}</h2>
                    <p className="opacity-90 mb-4">{data.course.description}</p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="opacity-80">Maximos estudiantes:</span>{' '}
                        <span className="font-semibold">{data.course.maxStudents}</span>
                      </div>
                      <div>
                        <span className="opacity-80">Inscritos:</span>{' '}
                        <span className="font-semibold">
                          {data.course.students.filter((s: Student) => s.active).length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="opacity-80">Diversidad de dominios:</span>
                        {domainDetails ? (
                          <DomainDiversityGauge
                            diversity={data.domainDiversity}
                            uniqueDomains={domainDetails.uniqueDomains}
                            totalStudents={domainDetails.totalStudents}
                          />
                        ) : (
                          <span className="text-white">{data.domainDiversity}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-yamabuki text-kokushoku py-2 px-4 hover:brightness-95 transition-colors font-medium"
                    >
                      Editar curso
                    </button>
                    <button
                      onClick={handleDeleteCourse}
                      disabled={deleteCourseMutation.isPending}
                      className="flex-1 bg-benihi text-gofuniro py-2 px-4 hover:brightness-90 disabled:opacity-50 transition-colors font-medium"
                    >
                      {deleteCourseMutation.isPending ? 'Eliminando...' : 'Eliminar curso'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Editar curso</h2>
                  <CourseForm
                    course={data.course}
                    onSubmit={(formData) => updateCourseMutation.mutate(formData as UpdateCourseDto)}
                    onCancel={() => setIsEditing(false)}
                    isLoading={updateCourseMutation.isPending}
                  />
                  {updateCourseMutation.isError && (
                    <p className="mt-4 text-benihi text-sm" role="alert">
                      {getApiErrorMessage(updateCourseMutation.error)}
                    </p>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Alumnos inscritos</h3>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-asagiiro text-gofuniro px-4 py-2 hover:brightness-90 transition-colors font-medium"
                  >
                    Agregar estudiante
                  </button>
                </div>

                <StudentList
                  students={data.course.students.filter((s: Student) => s.active)}
                  onDeleteStudent={handleDeleteStudent}
                  isDeleting={deletingStudentId}
                />

                <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Agregar estudiante">
                  <AddStudentForm
                    onSubmit={(studentData) => addStudentMutation.mutate(studentData)}
                    isLoading={addStudentMutation.isPending}
                  />
                  {addStudentMutation.isError && (
                    <p className="mt-3 text-benihi text-sm" role="alert">
                      {getApiErrorMessage(addStudentMutation.error)}
                    </p>
                  )}
                </Modal>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
