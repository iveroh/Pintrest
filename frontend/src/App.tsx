import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ResponsiveNavBar from './components/Navbar/ResponsiveNavBar'
import Profile from './pages/Profile/Profile'
import Home from "./pages/Home/Home"
import Signup from './pages/Signup/Signup'
import PostForm from './components/PostForm'
import Signin from './pages/Signin/Signin'
import Explore from './pages/Explore/Explore'
import { useAuth } from './context/authContext'
import { Toaster } from './components/ui/sonner'

function AppContent() {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="App">
      <ResponsiveNavBar onPostClick={() => {
        if (user) {
          setIsPostFormOpen(true);
        } else {
          navigate('/signup', { state: { showAlert: true } });
        }
      }} />
        {user && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          </Routes>
        )}
        {!user && (
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Signup alert={true} />} /> {"Redirect all routes except signin and signup to signup page while not logged in"}
          </Routes>
        )}
      {isPostFormOpen && <PostForm onClose={() => setIsPostFormOpen(false)} />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename="/">
      <Toaster/>
      <AppContent />
    </BrowserRouter>
  )
}

export default App;