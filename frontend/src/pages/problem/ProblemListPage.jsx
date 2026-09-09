import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProblems, getTagGroups, deleteProblem } from '../../api/problemApi'
import TagBadge from '../../components/common/TagBadge'
import Pagination from '../../components/common/Pagination'

const TAG_TYPE_LABELS = {
  GRADE: '학년',
  SEMESTER: '학기',
  UNIT: '대단원',
  SUB_UNIT: '소단원',
  TYPE: '유형',
  DIFFICULTY: '난이도',
}

function ProblemListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const tagIds = searchParams.getAll('tagIds').map(Number)
  const page = Number(searchParams.get('page') || 1)

  const [keywordInput, setKeywordInput] = useState(keyword)
  const [problems, setProblems] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [tagGroups, setTagGroups] = useState({})
  const [filterOpen, setFilterOpen] = useState(tagIds.length > 0)

  const loadProblems = useCallback(() => {
    getProblems({ keyword, tagIds, page }).then((data) => {
      setProblems(data.problems)
      setPageInfo(data.pageInfo)
    })
  }, [keyword, JSON.stringify(tagIds), page])

  useEffect(() => {
    loadProblems()
  }, [loadProblems])

  useEffect(() => {
    getTagGroups().then(setTagGroups)
  }, [])

  useEffect(() => {
    setKeywordInput(keyword)
  }, [keyword])

  const hasCondition = !!keyword || tagIds.length > 0

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keywordInput) params.set('keyword', keywordInput)
    tagIds.forEach((id) => params.append('tagIds', id))
    setSearchParams(params)
  }

  function toggleTag(tagId) {
    const params = new URLSearchParams(searchParams)
    params.delete('page')
    const current = params.getAll('tagIds').map(Number)
    params.delete('tagIds')
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId]
    next.forEach((id) => params.append('tagIds', id))
    setSearchParams(params)
  }

  function handleReset() {
    setSearchParams({})
  }

  function handlePageChange(nextPage) {
    const params = new URLSearchParams(searchParams)
    params.set('page', nextPage)
    setSearchParams(params)
  }

  async function handleDelete(id) {
    if (!window.confirm('이 문제를 삭제하시겠습니까?')) return
    await deleteProblem(id)
    loadProblems()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">문제 목록</h1>
        <Link
          to="/problem/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
        >
          새 문제 등록
        </Link>
      </div>

      {/* 검색 폼 */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4">
        <form onSubmit={handleSearch}>
          <div className="px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="제목 검색"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 whitespace-nowrap"
            >
              {filterOpen ? '필터 접기 ▲' : '필터 펼치기 ▼'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              검색
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              초기화
            </button>
          </div>

          {filterOpen && (
            <div className="border-t border-gray-200 px-4 py-3 space-y-3">
              {Object.entries(tagGroups).map(([type, tags]) => (
                <div key={type} className="flex items-start gap-3">
                  <span className="w-16 flex-shrink-0 text-xs font-semibold text-gray-500 pt-0.5">
                    {TAG_TYPE_LABELS[type] || type}
                  </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {tags.map((tag) => (
                      <label key={tag.id} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tagIds.includes(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                          className="w-3.5 h-3.5 accent-indigo-600"
                        />
                        <span className="text-sm text-gray-700">{tag.tagValue}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      {hasCondition && pageInfo && (
        <p className="text-sm text-gray-500 mb-3">
          총 {pageInfo.totalCount}개의 문제가 검색되었습니다.
        </p>
      )}

      {/* 문제 테이블 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-14">번호</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">제목</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-72">태그</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium w-28">등록일</th>
              <th className="px-4 py-3 text-center text-gray-600 font-medium w-32">관리</th>
            </tr>
          </thead>
          <tbody>
            {problems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  {hasCondition ? '검색 결과가 없습니다.' : '등록된 문제가 없습니다.'}
                </td>
              </tr>
            )}
            {problems.map((problem, idx) => (
              <tr key={problem.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">
                  {pageInfo ? (pageInfo.currentPage - 1) * pageInfo.pageSize + idx + 1 : idx + 1}
                </td>
                <td className="px-4 py-3">
                  <Link to={`/problem/${problem.id}`} className="text-gray-800 hover:text-indigo-600">
                    {problem.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {problem.tagList?.map((tag) => (
                      <TagBadge key={tag.id} tag={tag} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {problem.createdAt?.slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      to={`/problem/${problem.id}`}
                      className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      상세
                    </Link>
                    <Link
                      to={`/problem/${problem.id}/edit`}
                      className="text-xs px-2 py-1 rounded border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(problem.id)}
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

      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
    </div>
  )
}

export default ProblemListPage
