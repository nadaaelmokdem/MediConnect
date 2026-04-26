import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/navbar"
import Hero from "./pages/HomePage"
import { LangProvider } from "./context/lang"
import ChatPage from "./pages/ChatPage"

function App() {

  return (
   <>
   <LangProvider>
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/ai-chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
   </LangProvider>
   </>
  )
}

export default App
