import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStudent, submitAttempt } from '../../api/attemptApi'
import { getExamSheet } from '../../api/examsheetApi'

function RecordFormPage() {
  const { studentId, examSheetId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [problems, setProblems] = useState([])
  const [correctIds, setCorrectIds] = useState([])

  useEffect(() => {
    getStudent(studentId).then(setStudent)
    getExamSheet(examSheetId).then((data) => setProblems(data.problems))
  }, [studentId, examSheetId])

  function toggleCorrect(problemId) {
    setCorrectIds((prev) =>
      prev.includes(problemId) ? prev.filter((id) => id !== problemId) : [...prev, problemId]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const answers = problems.map((p) => ({
      problemId: p.problemId,
      isCorrect: correctIds.includes(p.problemId),
    }))
    await submitAttempt(studentId, examSheetId, answers)
    navigate(`/attempt/students/${studentId}/stats`)
  }

  if (!student) return null

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">응시 기록 입력</h1>
      <p className="text-sm text-gray-500 mb-6">{student.name} 학생 — 문제별로 정답 여부를 체크하세요.</p>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-medium w-14">번호</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">문제</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium w-20">정답</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => (
                <tr key={p.problemId} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{p.sortOrder}</td>
                  <td className="px-4 py-3 text-gray-800">{p.title}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={correctIds.includes(p.problemId)}
                      onChange={() => toggleCorrect(p.problemId)}
                      className="w-4 h-4 rounded accent-indigo-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => navigate(`/attempt/students/${studentId}/stats`)}
            className="px-5 py-2 bg-white text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default RecordFormPage
