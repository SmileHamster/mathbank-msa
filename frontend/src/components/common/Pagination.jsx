function Pagination({ pageInfo, onPageChange }) {
  if (!pageInfo || pageInfo.totalPages <= 0) return null

  // 백엔드 PageInfo.hasPrev()/hasNext()는 Jackson이 인식하는 get/is 접두사가
  // 아니라 JSON에 실리지 않을 수 있어, currentPage/totalPages로 직접 계산한다.
  const hasPrev = pageInfo.currentPage > 1
  const hasNext = pageInfo.currentPage < pageInfo.totalPages

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => onPageChange(pageInfo.currentPage - 1)}
        className={
          hasPrev
            ? 'px-3 py-1.5 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50'
            : 'px-3 py-1.5 text-sm rounded border border-gray-200 text-gray-300 pointer-events-none'
        }
      >
        이전
      </button>
      <span className="text-sm text-gray-600">
        {pageInfo.currentPage} / {pageInfo.totalPages}
      </span>
      <button
        type="button"
        disabled={!hasNext}
        onClick={() => onPageChange(pageInfo.currentPage + 1)}
        className={
          hasNext
            ? 'px-3 py-1.5 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50'
            : 'px-3 py-1.5 text-sm rounded border border-gray-200 text-gray-300 pointer-events-none'
        }
      >
        다음
      </button>
    </div>
  )
}

export default Pagination
