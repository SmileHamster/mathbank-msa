import client from './axios'

export function getProblems({ keyword, tagIds, page = 1, size = 10 } = {}) {
  return client
    .get('/api/problems', { params: { keyword, tagIds, page, size } })
    .then((res) => res.data.data)
}

export function getProblem(id) {
  return client.get(`/api/problems/${id}`).then((res) => res.data.data)
}

export function createProblem(form) {
  return client.post('/api/problems', form).then((res) => res.data.data)
}

export function updateProblem(id, form) {
  return client.put(`/api/problems/${id}`, form).then((res) => res.data.data)
}

export function deleteProblem(id) {
  return client.delete(`/api/problems/${id}`).then((res) => res.data.data)
}

export function getTagGroups() {
  return client.get('/api/problems/tags').then((res) => res.data.data)
}

export function uploadProblemImage(id, file) {
  const formData = new FormData()
  formData.append('image', file)
  return client
    .post(`/api/problems/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data.data)
}

export function deleteProblemImage(id) {
  return client.delete(`/api/problems/${id}/image`).then((res) => res.data.data)
}
