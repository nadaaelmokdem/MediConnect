import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { LangProvider } from "./context/LangContext"
import Navbar from "./components/Navbar"
import { ProtectedRoute } from "./components/ProtectedRoute"
import HomePage from "./pages/HomePage"
import ChatPage from "./pages/ChatPage"
import DoctorDashboard from "./pages/DoctorDashboard"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"
import { useState } from "react"

function App() {
  const [loginMail,setLoginMail] = useState<string>("");
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <LangProvider>
            {/* Navigation - shown on all pages except auth pages */}
            <Routes>
              <Route path="/login" element={null} />
              <Route path="/register" element={null} />
              <Route path="/forgot-password" element={null} />
              <Route path="*" element={<Navbar />} />
            </Routes>

            {/* Routes */}
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<SignIn setloginEmail={setLoginMail}/>} />
              <Route path="/register" element={<SignUp loginMail={loginMail}/>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                    <HomePage />
                }
              />
              <Route
                path="/ai-chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/find-doctor"
                element={
                  <ProtectedRoute>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </LangProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
