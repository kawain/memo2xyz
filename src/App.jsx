import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import CreatePage from './components/CreatePage'
import LoginPage from './components/LoginPage'
import Footer from './components/Footer'

function App () {
  const now = new Date()
  // 皇紀
  const year = now.getFullYear() + 660
  const baseURL = import.meta.env.VITE_API_BASE_URL
  const [currentPage, setCurrentPage] = useState('homePage')
  const [login, setLogin] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'homePage':
        return <HomePage baseURL={baseURL} login={login} />
      case 'createPage':
        return <CreatePage baseURL={baseURL} setCurrentPage={setCurrentPage} />
      case 'loginPage':
        return (
          <LoginPage
            baseURL={baseURL}
            setCurrentPage={setCurrentPage}
            setLogin={setLogin}
          />
        )
      default:
        return <HomePage baseURL={baseURL} login={login} />
    }
  }

  return (
    <>
      <Navbar
        baseURL={baseURL}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        login={login}
        setLogin={setLogin}
      />

      <div className='container'>{renderPage()}</div>

      <Footer year={year} />
    </>
  )
}

export default App