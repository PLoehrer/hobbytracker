import './App.css'
import Header from './components/Header'
import HobbyDetailPage from './pages/hobbies/HobbyDetailPage'
import HobbyListPage from './pages/hobbies/HobbyListPage'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<HobbyListPage />} />
        <Route path="/hobbies/:id" element={<HobbyDetailPage />} />
      </Routes>
    </div>
  )
}

export default App