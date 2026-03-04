import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/Landing'
import OnboardingPage from './pages/Onboarding'
import SilenceRoom from './pages/SilenceRoom'
import MatchPage from './pages/Match'
import HomePage from './pages/Home'
import AIAssistant from './pages/AIAssistant'
import ChatRoom from './pages/ChatRoom'

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/silence" element={<SilenceRoom />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
