import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getExamSheets, deleteExamSheet } from '../../api/examsheetApi'

function ExamSheetListPage() {
  const [examSheets, setExamSheets] = useState([])

  const load = useCallback(() => {
    getExamSheets().then(setExamSheets)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleDelete(id) {
    if (!window.confirm('이 시험지를 삭제하시겠습니까?')) return
    await deleteExamSheet(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">시험지 목록</h1>
        <Link
          to="/examsheet/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
        >
          새 시험지 생성
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-14">번호</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">시험지명</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-24">문제 수</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-28">생성일</th>
              <th className="px-4 py-3 text-center text-gray-600 font-medium w-28">관리</th>
            </tr>
          </thead>
          <tbody>
            {examSheets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  생성된 시험지가 없습니다.
                </td>
              </tr>
            )}
            {examSheets.map((sheet, idx) => (
              <tr key={sheet.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                <td className="px-4 py-3">
                  <Link to={`/examsheet/${sheet.id}`} className="text-gray-800 hover:text-indigo-600">
                    {sheet.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{sheet.totalCount}문제</td>
                <td className="px-4 py-3 text-gray-500">{sheet.createdAt?.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      to={`/examsheet/${sheet.id}`}
                      className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      상세
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(sheet.id)}
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

export default ExamSheetListPage
