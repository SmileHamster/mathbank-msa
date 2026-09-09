import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getStudent } from '../../api/attemptApi'
import { getExamSheets } from '../../api/examsheetApi'

function RecordSelectPage() {
  const { studentId } = useParams()
  const [student, setStudent] = useState(null)
  const [examSheets, setExamSheets] = useState([])

  useEffect(() => {
    getStudent(studentId).then(setStudent)
    getExamSheets().then(setExamSheets)
  }, [studentId])

  if (!student) return null

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">응시 기록 입력</h1>
      <p className="text-sm text-gray-500 mb-6">
        {student.name}
        {student.grade && ` (${student.grade})`} 학생이 응시한 시험지를 선택하세요.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">시험지명</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-24">학년</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-24">문제 수</th>
              <th className="px-4 py-3 text-center text-gray-600 font-medium w-24">선택</th>
            </tr>
          </thead>
          <tbody>
            {examSheets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                  생성된 시험지가 없습니다.
                </td>
              </tr>
            )}
            {examSheets.map((sheet) => (
              <tr key={sheet.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{sheet.name}</td>
                <td
                  className={
                    student.grade && sheet.gradeName === student.grade
                      ? 'px-4 py-3 text-indigo-600 font-medium'
                      : 'px-4 py-3 text-gray-500'
                  }
                >
                  {sheet.gradeName}
                </td>
                <td className="px-4 py-3 text-gray-600">{sheet.totalCount}문제</td>
                <td className="px-4 py-3 text-center">
                  <Link
                    to={`/attempt/students/${studentId}/record/${sheet.id}`}
                    className="text-xs px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    선택
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecordSelectPage
