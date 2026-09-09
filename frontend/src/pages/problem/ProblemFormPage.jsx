import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getProblem,
  createProblem,
  updateProblem,
  getTagGroups,
  uploadProblemImage,
  deleteProblemImage,
} from '../../api/problemApi'
import KatexRenderer from '../../components/common/KatexRenderer'

const TAG_TYPE_LABELS = {
  GRADE: '학년',
  SEMESTER: '학기',
  UNIT: '대단원',
  SUB_UNIT: '소단원',
  TYPE: '문제유형',
  DIFFICULTY: '난이도',
}

function ProblemFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [tagGroups, setTagGroups] = useState({})
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [answer, setAnswer] = useState('')
  const [explanation, setExplanation] = useState('')
  const [tagIds, setTagIds] = useState([])
  const [imagePath, setImagePath] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [unitWarning, setUnitWarning] = useState(false)

  useEffect(() => {
    getTagGroups().then(setTagGroups)
  }, [])

  useEffect(() => {
    if (!isEdit) return
    getProblem(id).then((data) => {
      setTitle(data.title)
      setContent(data.content)
      setAnswer(data.answer)
      setExplanation(data.explanation || '')
      setTagIds((data.tagList || []).map((t) => t.id))
      setImagePath(data.imagePath)
    })
  }, [id, isEdit])

  const unitTagIds = (tagGroups.UNIT || []).map((t) => t.id)

  function toggleTag(tagId, tagType) {
    setTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((t) => t !== tagId)
      }
      if (tagType === 'UNIT') {
        const displaced = prev.some((t) => unitTagIds.includes(t))
        if (displaced) {
          setUnitWarning(true)
          setTimeout(() => setUnitWarning(false), 3000)
        }
        return [...prev.filter((t) => !unitTagIds.includes(t)), tagId]
      }
      return [...prev, tagId]
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})

    const form = { title, content, answer, explanation, tagIds }

    try {
      let problemId = id
      if (isEdit) {
        await updateProblem(id, form)
      } else {
        problemId = await createProblem(form)
      }

      if (imageFile) {
        await uploadProblemImage(problemId, imageFile)
      } else if (isEdit && removeImage) {
        await deleteProblemImage(problemId)
      }

      navigate(`/problem/${problemId}`)
    } catch (err) {
      const message = err.response?.data?.message
      if (message) {
        setErrors({ general: message })
      }
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-gray-800 mb-6">{isEdit ? '문제 수정' : '새 문제 등록'}</h1>

      {errors.general && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            문제 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
            required
          />
          <p className="mt-1 text-xs text-gray-400">수식은 $...$ (인라인) 또는 $$...$$ (블록)으로 입력하세요</p>
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">미리보기</label>
            <KatexRenderer
              content={content}
              className="min-h-12 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">그림/도형 이미지</label>
          {isEdit && imagePath && !removeImage && (
            <div className="mb-2">
              <img
                src={`/api/problems/images/${imagePath}`}
                className="max-w-xs border border-gray-200 rounded-md"
                alt="문제 이미지"
              />
              <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-red-600"
                />
                <span className="text-xs text-red-500">이미지 삭제</span>
              </label>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-1.5 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 file:text-sm hover:file:bg-gray-200"
          />
          <p className="mt-1 text-xs text-gray-400">
            도형·그래프 등 LaTeX로 표현하기 어려운 그림은 이미지로 첨부하세요 (5MB 이하)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            정답 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">해설</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">태그 선택</label>
          <div className="space-y-3">
            {Object.entries(tagGroups).map(([type, tags]) => (
              <div key={type} className="border border-gray-200 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500">{TAG_TYPE_LABELS[type] || type}</span>
                  {type === 'UNIT' && <span className="text-xs text-gray-400">(하나만 선택)</span>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tagIds.includes(tag.id)}
                        onChange={() => toggleTag(tag.id, type)}
                        className="w-3.5 h-3.5 rounded accent-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{tag.tagValue}</span>
                    </label>
                  ))}
                </div>
                {type === 'UNIT' && unitWarning && (
                  <p className="mt-2 text-xs text-red-500">
                    대단원은 하나만 선택할 수 있습니다. 이전 선택이 해제되었습니다.
                  </p>
                )}
              </div>
            ))}
          </div>
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
            onClick={() => navigate('/problem/list')}
            className="px-5 py-2 bg-white text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProblemFormPage
