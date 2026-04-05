import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { MainLayout } from "./components/layout/MainLayout"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { EmployeeDashboard } from "./pages/EmployeeDashboard"
import { AdminDashboard } from "./pages/AdminDashboard"
import { ProfilePage } from "./pages/ProfilePage"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {}
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            
            {}
            <Route 
              path="admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="employees" element={<div className="text-2xl font-bold">Employees Page coming soon...</div>} />
            <Route path="leaves" element={<div className="text-2xl font-bold">Leaves Page coming soon...</div>} />
            <Route path="*" element={<div className="text-2xl font-bold text-center py-20">404 - Not Found</div>} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  )
}

export default App
