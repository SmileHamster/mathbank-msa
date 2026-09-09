const COLOR_BY_TYPE = {
  GRADE: 'bg-blue-100 text-blue-700',
  DIFFICULTY: 'bg-red-100 text-red-700',
  TYPE: 'bg-green-100 text-green-700',
}

function TagBadge({ tag }) {
  const colorClass = COLOR_BY_TYPE[tag.tagType] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>{tag.tagValue}</span>
  )
}

export default TagBadge
