import { Link, useLocation } from 'react-router-dom'

const MENU = [
  { label: '문제 관리', to: '/problem/list', prefix: '/problem' },
  { label: '시험지 관리', to: '/examsheet/list', prefix: '/examsheet' },
  { label: '학생 관리', to: '/attempt/students', prefix: '/attempt' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0 h-full">
      <div className="px-6 py-5 border-b border-gray-200">
        <span className="text-indigo-700 font-bold text-xl">MathBank</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {MENU.map((item) => {
          const active = location.pathname.startsWith(item.prefix)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ' +
                (active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100')
              }
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
