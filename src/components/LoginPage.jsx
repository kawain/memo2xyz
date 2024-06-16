import { useState } from 'react'

function LoginPage ({ baseURL, setCurrentPage, setLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const mode = formData.get('mode')
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const response = await fetch(`${baseURL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mode, username, password }),
        credentials: 'include'
      })
      const data = await response.json()
      if (data.msg === 'ok') {
        setLogin(true)
        setCurrentPage('homePage')
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit} className='loginForm'>
        <input type='hidden' name='mode' value='login' />
        <div>
          <label htmlFor='username'>ID</label>
          <input type='text' id='username' name='username' autoComplete='off' />
        </div>
        <div>
          <label htmlFor='password'>パスワード</label>
          <input
            type='password'
            id='password'
            name='password'
            autoComplete='off'
          />
        </div>
        <button type='submit'>送信</button>
      </form>
    </>
  )
}

export default LoginPage
