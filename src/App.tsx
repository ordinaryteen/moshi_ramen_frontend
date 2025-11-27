import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Komponen Dummy Dashboard (Nanti kita isi beneran)
function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <h1 className="text-4xl">Selamat Datang, Staff!</h1>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Route Dashboard (Sementara open, nanti kita protect) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Default Redirect ke Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App