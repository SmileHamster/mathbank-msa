import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTagGroups } from '../../api/problemApi'
import { createExamSheet } from '../../api/examsheetApi'

function ExamSheetFormPage() {
  const navigate = useNavigate()
  const [tagGroups, setTagGroups] = useState({})
  const [name, setName] = useState('')
  const [gradeTagId, setGradeTagId] = useState('')
  const [semesterTagId, setSemesterTagId] = useState('')
  const [unitTagIds, setUnitTagIds] = useState([])
  const [difficultyDistribution, setDifficultyDistribution] = useState({})
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    getTagGroups().then(setTagGroups)
  }, [])

  const totalCount = useMemo(
    () => Object.values(difficultyDistribution).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [difficultyDistribution]
  )

  function toggleUnit(tagId) {
    setUnitTagIds((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]))
  }

  function handleDifficultyChange(tagId, value) {
    setDifficultyDistribution((prev) => ({ ...prev, [tagId]: Number(value) || 0 }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    try {
      const id = await createExamSheet({
        name,
        gradeTagId: gradeTagId ? Number(gradeTagId) : null,
        semesterTagId: semesterTagId ? Number(semesterTagId) : null,
        unitTagIds,
        difficultyDistribution,
      })
      navigate(`/examsheet/${id}`)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || '시험지 생성에 실패했습니다.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">시험지 자동 생성</h1>
        <button type="button" onClick={() => navigate('/examsheet/list')} className="text-sm text-gray-500 hover:text-gray-700">
          ← 목록으로
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시험지 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 2024년 중2 1학기 중간고사"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            required
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            학년 <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {(tagGroups.GRADE || []).map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gradeTagId"
                  checked={gradeTagId === String(tag.id)}
                  onChange={() => setGradeTagId(String(tag.id))}
                  className="accent-indigo-600"
                  required
                />
                <span className="text-sm text-gray-700">{tag.tagValue}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            학기 <span className="text-gray-400 font-normal">(선택)</span>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="semesterTagId"
                checked={semesterTagId === ''}
                onChange={() => setSemesterTagId('')}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700">전체</span>
            </label>
            {(tagGroups.SEMESTER || []).map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="semesterTagId"
                  checked={semesterTagId === String(tag.id)}
                  onChange={() => setSemesterTagId(String(tag.id))}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-gray-700">{tag.tagValue}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            단원 <span className="text-gray-400 font-normal">(선택, 복수 선택 가능)</span>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {(tagGroups.UNIT || []).map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={unitTagIds.includes(tag.id)}
                  onChange={() => toggleUnit(tag.id)}
                  className="w-3.5 h-3.5 accent-indigo-600"
                />
                <span className="text-sm text-gray-700">{tag.tagValue}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">난이도별 문제 수</p>
            <span className="text-sm text-gray-500">
              합계: <span className="font-semibold text-indigo-600">{totalCount}</span>문제
            </span>
          </div>
          <div className="flex flex-wrap gap-6">
            {(tagGroups.DIFFICULTY || []).map((tag) => (
              <div key={tag.id} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 w-8">{tag.tagValue}</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={difficultyDistribution[tag.id] ?? 0}
                  onChange={(e) => handleDifficultyChange(tag.id, e.target.value)}
                  className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <span className="text-sm text-gray-500">문제</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
          >
            시험지 생성
          </button>
          <button
            type="button"
            onClick={() => navigate('/examsheet/list')}
            className="px-6 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExamSheetFormPage
