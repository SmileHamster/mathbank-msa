import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStudent } from '../../api/attemptApi'
import { getTagGroups } from '../../api/problemApi'

function StudentFormPage() {
  const navigate = useNavigate()
  const [gradeTags, setGradeTags] = useState([])
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [memo, setMemo] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getTagGroups().then((groups) => setGradeTags(groups.GRADE || []))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const id = await createStudent({ name, grade: grade || null, memo })
      navigate(`/attempt/students/${id}/stats`)
    } catch (err) {
      setError(err.response?.data?.message || '학생 등록에 실패했습니다.')
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-6">학생 등록</h1>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">학년</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            <option value="">선택 안 함</option>
            {gradeTags.map((tag) => (
              <option key={tag.id} value={tag.tagValue}>
                {tag.tagValue}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => navigate('/attempt/students')}
            className="px-5 py-2 bg-white text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default StudentFormPage
