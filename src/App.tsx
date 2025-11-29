import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Kitchen from './pages/Kitchen';
import ProtectedRoute from './components/ProtectedRoute'; // <--- Import Satpam

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* HALAMAN YANG DIPROTEKSI */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/kitchen" element={
          <ProtectedRoute>
            <Kitchen />
          </ProtectedRoute>
        } />

        {/* Redirect default ke Dashboard (yang nanti bakal dicek satpam) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App