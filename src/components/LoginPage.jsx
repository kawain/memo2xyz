import { useState } from 'react'

function LoginPage ({ baseURL, setCurrentPage, setLogin, setUsername }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const mode = formData.get('mode')
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const response = await fetch(`${baseURL}/index.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mode, username, password }),
        credentials: 'include'
      })
      const data = await response.json()
      if (data.msg === 'ok') {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userName', username)
        setUsername(username)
        setLogin(true)
        setCurrentPage('homePage')
      } else {
        alert('メッセージ: ' + data.error)
      }
    } catch (error) {
      alert('エラーが発生しました: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit} className='loginForm'>
        <input type='hidden' name='mode' value='login' />
        <div>
          <label htmlFor='username'>ID</label>
          <input
            type='text'
            id='username'
            name='username'
            autoComplete='off'
            required
          />
        </div>
        <div>
          <label htmlFor='password'>パスワード</label>
          <input
            type='password'
            id='password'
            name='password'
            autoComplete='off'
            required
          />
        </div>
        <button type='submit'>送信</button>
      </form>
    </>
  )
}

export default LoginPage
