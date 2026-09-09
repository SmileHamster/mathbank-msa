import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import ProblemListPage from './pages/problem/ProblemListPage'
import ProblemFormPage from './pages/problem/ProblemFormPage'
import ProblemDetailPage from './pages/problem/ProblemDetailPage'
import ExamSheetListPage from './pages/examsheet/ExamSheetListPage'
import ExamSheetFormPage from './pages/examsheet/ExamSheetFormPage'
import ExamSheetDetailPage from './pages/examsheet/ExamSheetDetailPage'
import StudentListPage from './pages/attempt/StudentListPage'
import StudentFormPage from './pages/attempt/StudentFormPage'
import StudentStatsPage from './pages/attempt/StudentStatsPage'
import RecordSelectPage from './pages/attempt/RecordSelectPage'
import RecordFormPage from './pages/attempt/RecordFormPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Navigate to="/problem/list" replace />} />

            <Route path="/problem/list" element={<ProblemListPage />} />
            <Route path="/problem/new" element={<ProblemFormPage />} />
            <Route path="/problem/:id" element={<ProblemDetailPage />} />
            <Route path="/problem/:id/edit" element={<ProblemFormPage />} />

            <Route path="/examsheet/list" element={<ExamSheetListPage />} />
            <Route path="/examsheet/new" element={<ExamSheetFormPage />} />
            <Route path="/examsheet/:id" element={<ExamSheetDetailPage />} />

            <Route path="/attempt/students" element={<StudentListPage />} />
            <Route path="/attempt/students/new" element={<StudentFormPage />} />
            <Route path="/attempt/students/:studentId/stats" element={<StudentStatsPage />} />
            <Route path="/attempt/students/:studentId/record" element={<RecordSelectPage />} />
            <Route path="/attempt/students/:studentId/record/:examSheetId" element={<RecordFormPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
