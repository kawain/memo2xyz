import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import CreatePage from './components/CreatePage'
import LoginPage from './components/LoginPage'
import FileUpload from './components/FileUpload'
import ChatPage from './components/ChatPage'
import Footer from './components/Footer'

function App () {
  const now = new Date()
  // 皇紀
  const year = now.getFullYear() + 660
  const baseURL = import.meta.env.VITE_API_BASE_URL
  const [currentPage, setCurrentPage] = useState('homePage')
  const [login, setLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userName = localStorage.getItem('userName')
    if (isLoggedIn === 'true') {
      setUsername(userName)
      setLogin(true)
    }
  }, [])

  const renderPage = () => {
    const pages = {
      homePage: (
        <HomePage
          baseURL={baseURL}
          login={login}
          update={update}
          setUpdate={setUpdate}
        />
      ),
      createPage: (
        <CreatePage
          baseURL={baseURL}
          setCurrentPage={setCurrentPage}
          setUpdate={setUpdate}
        />
      ),
      loginPage: (
        <LoginPage
          baseURL={baseURL}
          setCurrentPage={setCurrentPage}
          setLogin={setLogin}
          setUsername={setUsername}
        />
      ),
      fileUpload: (
        <FileUpload baseURL={baseURL} update={update} setUpdate={setUpdate} />
      ),
      chatPage: <ChatPage baseURL={baseURL} username={username} />
    }

    return pages[currentPage] || pages.homePage
  }

  return (
    <>
      <Navbar
        baseURL={baseURL}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        login={login}
        setLogin={setLogin}
        setUsername={setUsername}
      />

      <div className='container'>{renderPage()}</div>

      <Footer year={year} />
    </>
  )
}

export default App
