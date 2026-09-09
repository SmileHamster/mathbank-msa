import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProblem } from '../../api/problemApi'
import TagBadge from '../../components/common/TagBadge'
import KatexRenderer from '../../components/common/KatexRenderer'

function ProblemDetailPage() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    getProblem(id).then(setProblem)
  }, [id])

  if (!problem) return null

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">{problem.title}</h1>
        <div className="flex flex-wrap gap-1.5">
          {problem.tagList?.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">문제</h2>
        <KatexRenderer content={problem.content} className="text-gray-800 leading-relaxed whitespace-pre-wrap" />
        {problem.imagePath && (
          <img
            src={`/api/problems/images/${problem.imagePath}`}
            className="mt-4 max-w-md border border-gray-200 rounded-md"
            alt="문제 이미지"
          />
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAnswer((v) => !v)}
          className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {showAnswer ? '정답 닫기' : '정답 보기'}
        </button>
        {showAnswer && (
          <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-semibold text-green-600 mb-1">정답</p>
            <p className="text-gray-800 whitespace-pre-wrap">{problem.answer}</p>
          </div>
        )}
      </div>

      {problem.explanation && (
        <div>
          <button
            type="button"
            onClick={() => setShowExplanation((v) => !v)}
            className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {showExplanation ? '해설 닫기' : '해설 보기'}
          </button>
          {showExplanation && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-600 mb-1">해설</p>
              <KatexRenderer content={problem.explanation} className="text-gray-800 leading-relaxed whitespace-pre-wrap" />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <Link
          to={`/problem/${problem.id}/edit`}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
        >
          수정
        </Link>
        <Link
          to="/problem/list"
          className="px-4 py-2 bg-white text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          목록으로
        </Link>
      </div>
    </div>
  )
}

export default ProblemDetailPage
