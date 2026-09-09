import { useEffect, useRef } from 'react'
import renderMathInElement from 'katex/contrib/auto-render'
import 'katex/dist/katex.min.css'

function KatexRenderer({ content, className }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    // textContent로 넣어야 사용자 입력이 HTML로 해석되지 않는다 (XSS 방지).
    ref.current.textContent = content || ''
    renderMathInElement(ref.current, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
    })
  }, [content])

  return <div ref={ref} className={className} />
}

export default KatexRenderer
