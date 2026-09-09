import client from './axios'

export function getExamSheets() {
  return client.get('/api/examsheets').then((res) => res.data.data)
}

export function getExamSheet(id) {
  return client.get(`/api/examsheets/${id}`).then((res) => res.data.data)
}

export function createExamSheet(form) {
  return client.post('/api/examsheets', form).then((res) => res.data.data)
}

export function deleteExamSheet(id) {
  return client.delete(`/api/examsheets/${id}`).then((res) => res.data.data)
}

export function pdfUrl(id) {
  return `/api/examsheets/${id}/pdf`
}

export function pdfAnswerUrl(id) {
  return `/api/examsheets/${id}/pdf/answer`
}
