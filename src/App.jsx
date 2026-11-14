import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToHash from './components/layout/Effects/ScrollToHash.jsx'
import Spotlight from './components/layout/Effects/Spotlight.jsx'
import { LeadFormProvider } from './components/sections/LeadForm/LeadFormContext.jsx'
import HomePage from './pages/HomePage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import ProgramPage from './pages/ProgramPage.jsx'

export default function App() {
  return (
    <LeadFormProvider>
      <ScrollToHash />
      <Spotlight />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/programa/:id" element={<ProgramPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LeadFormProvider>
  )
}
