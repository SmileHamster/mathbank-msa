import client from './axios'

export function getStudents() {
  return client.get('/api/students').then((res) => res.data.data)
}

export function getStudent(id) {
  return client.get(`/api/students/${id}`).then((res) => res.data.data)
}

export function createStudent(form) {
  return client.post('/api/students', form).then((res) => res.data.data)
}

export function updateStudent(id, form) {
  return client.put(`/api/students/${id}`, form).then((res) => res.data.data)
}

export function deleteStudent(id) {
  return client.delete(`/api/students/${id}`).then((res) => res.data.data)
}

export function submitAttempt(studentId, examSheetId, answers) {
  return client
    .post(`/api/attempts/${studentId}/exams/${examSheetId}`, answers)
    .then((res) => res.data.data)
}

export function getStudentStats(studentId) {
  return client.get(`/api/attempts/${studentId}/stats`).then((res) => res.data.data)
}

export function getExamResult(studentId, examSheetId) {
  return client.get(`/api/attempts/${studentId}/exams/${examSheetId}`).then((res) => res.data.data)
}
