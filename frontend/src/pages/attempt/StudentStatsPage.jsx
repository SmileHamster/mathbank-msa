import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { getStudent, getStudentStats } from '../../api/attemptApi'

const INDIGO = '#4f46e5'
const GRAY = '#e5e7eb'

function StudentStatsPage() {
  const { studentId } = useParams()
  const [student, setStudent] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStudent(studentId).then(setStudent)
    getStudentStats(studentId).then(setStats)
  }, [studentId])

  if (!student || !stats) return null

  const examResults = stats.examResults || []
  const totalCount = examResults.reduce((sum, r) => sum + r.totalCount, 0)
  const correctCount = examResults.reduce((sum, r) => sum + r.correctCount, 0)
  const overallData = [
    { name: '정답', value: correctCount },
    { name: '오답', value: totalCount - correctCount },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{student.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {student.grade}
            {student.memo && ` · ${student.memo}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/attempt/students/${studentId}/record`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
          >
            응시 기록 입력
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">시험지</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-24">점수</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-24">정답 수</th>
              <th className="px-4 py-3 text-center text-gray-600 font-medium w-24">관리</th>
            </tr>
          </thead>
          <tbody>
            {examResults.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                  응시 기록이 없습니다.
                </td>
              </tr>
            )}
            {examResults.map((r) => (
              <tr key={r.examSheetId} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{r.examSheetName}</td>
                <td className="px-4 py-3 text-gray-600">{r.score}점</td>
                <td className="px-4 py-3 text-gray-600">
                  {r.correctCount} / {r.totalCount}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    to={`/attempt/students/${studentId}/record/${r.examSheetId}`}
                    className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    수정
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {examResults.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">성적 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-2">전체 정답률</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={overallData} dataKey="value" innerRadius={45} outerRadius={70}>
                      <Cell fill={INDIGO} />
                      <Cell fill={GRAY} />
                    </Pie>
                    <Legend verticalAlign="bottom" height={24} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-2">단원별 정답률</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.unitStats} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="unitName" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="correctRate" name="정답률(%)" fill={INDIGO} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-2">난이도별 정답률</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.difficultyStats} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="difficulty" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="correctRate" name="정답률(%)" fill={INDIGO} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentStatsPage
