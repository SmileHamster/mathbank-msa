import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getExamSheet, deleteExamSheet, pdfUrl, pdfAnswerUrl } from '../../api/examsheetApi'
import TagBadge from '../../components/common/TagBadge'
import KatexRenderer from '../../components/common/KatexRenderer'

function ExamSheetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [examSheet, setExamSheet] = useState(null)
  const [shownAnswers, setShownAnswers] = useState({})
  const [allShown, setAllShown] = useState(false)

  useEffect(() => {
    getExamSheet(id).then(setExamSheet)
  }, [id])

  async function handleDelete() {
    if (!window.confirm('이 시험지를 삭제하시겠습니까?')) return
    await deleteExamSheet(id)
    navigate('/examsheet/list')
  }

  function toggleAnswer(problemId) {
    setShownAnswers((prev) => ({ ...prev, [problemId]: !prev[problemId] }))
  }

  function toggleAll() {
    const next = !allShown
    setAllShown(next)
    const map = {}
    examSheet.problems.forEach((p) => {
      map[p.problemId] = next
    })
    setShownAnswers(map)
  }

  if (!examSheet) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{examSheet.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            총 {examSheet.totalCount}문제 · {examSheet.createdAt?.slice(0, 10)} 생성
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleAll}
            className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
          >
            {allShown ? '정답 모두 숨기기' : '정답 모두 보기'}
          </button>
          <button
            type="button"
            onClick={() => window.open(pdfUrl(id), '_blank')}
            className="px-3 py-2 text-sm border border-indigo-300 rounded text-indigo-600 hover:bg-indigo-50"
          >
            문제지 PDF
          </button>
          <button
            type="button"
            onClick={() => window.open(pdfAnswerUrl(id), '_blank')}
            className="px-3 py-2 text-sm border border-indigo-300 rounded text-indigo-600 hover:bg-indigo-50"
          >
            답안지 PDF
          </button>
          <Link to="/examsheet/list" className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
            ← 목록
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-2 text-sm border border-red-300 rounded text-red-600 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {examSheet.problems.map((problem) => (
          <div key={problem.problemId} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-bold text-indigo-600">문제 {problem.sortOrder}</span>
              <div className="flex flex-wrap gap-1">
                {problem.tagList?.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
            </div>

            <p className="text-sm font-medium text-gray-800 mb-2">{problem.title}</p>

            <KatexRenderer content={problem.content} className="text-sm text-gray-700 leading-relaxed mb-3" />
            {problem.imagePath && (
              <img
                src={`/api/problems/images/${problem.imagePath}`}
                className="mb-3 max-w-sm border border-gray-200 rounded-md"
                alt="문제 이미지"
              />
            )}

            <div className="border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => toggleAnswer(problem.problemId)}
                className="text-xs px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {shownAnswers[problem.problemId] ? '정답 숨기기' : '정답 보기'}
              </button>
              {shownAnswers[problem.problemId] && (
                <>
                  <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                    <span className="font-medium">정답: </span>
                    <span>{problem.answer}</span>
                  </div>
                  {problem.explanation && (
                    <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                      <span className="font-medium">해설: </span>
                      <span>{problem.explanation}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExamSheetDetailPage
