import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Chatbot from './pages/Chatbot'
import ChatMahasiswa from './pages/ChatMahasiswa'
import ChatsDosen from './pages/ChatsDosen'
import firebase from 'firebase/compat/app'
import LandingPage from './pages/LandingPage'

function App() {
  console.log('config firebase',firebase);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chatmahasiswa" element={<ChatMahasiswa />} />
        <Route path="/chatsdosen" element={<ChatsDosen />} />
        <Route path="/chatbot/:id" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App
