import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStudents, deleteStudent } from '../../api/attemptApi'

function StudentListPage() {
  const [students, setStudents] = useState([])

  const load = useCallback(() => {
    getStudents().then(setStudents)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleDelete(id) {
    if (!window.confirm('이 학생을 삭제하시겠습니까? 응시 기록도 함께 삭제됩니다.')) return
    await deleteStudent(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">학생 목록</h1>
        <Link
          to="/attempt/students/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
        >
          학생 등록
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-14">번호</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">이름</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-24">학년</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">메모</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-28">등록일</th>
              <th className="px-4 py-3 text-center text-gray-600 font-medium w-28">관리</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  등록된 학생이 없습니다.
                </td>
              </tr>
            )}
            {students.map((student, idx) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                <td className="px-4 py-3">
                  <Link to={`/attempt/students/${student.id}/stats`} className="text-gray-800 hover:text-indigo-600">
                    {student.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{student.grade}</td>
                <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{student.memo}</td>
                <td className="px-4 py-3 text-gray-500">{student.createdAt?.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      to={`/attempt/students/${student.id}/stats`}
                      className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      상세
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(student.id)}
                      className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentListPage
