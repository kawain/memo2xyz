import { useState } from 'react'

function CreatePage ({ baseURL, setCurrentPage, setUpdate }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const mode = formData.get('mode')
    const title = formData.get('title')
    const content = formData.get('content')

    try {
      const response = await fetch(`${baseURL}/index.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mode, title, content }),
        credentials: 'include'
      })
      const data = await response.json()
      if (data.msg === 'ok') {
        setUpdate(pre => pre + 1)
        setCurrentPage('homePage')
      } else {
        alert('作成に失敗しました。')
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
      <h2>新規作成</h2>
      <form onSubmit={handleSubmit} className='createForm'>
        <input type='hidden' name='mode' value='create' />
        <div>
          <label htmlFor='title'>タイトル</label>
          <input
            type='text'
            id='title'
            name='title'
            placeholder='タイトル'
            required
          />
        </div>
        <div>
          <label htmlFor='content'>内容</label>
          <textarea
            wrap='off'
            id='content'
            name='content'
            placeholder='内容'
            required
          />
        </div>
        <button type='submit'>新規入力</button>
        <button type='reset'>クリア</button>
      </form>
    </>
  )
}

export default CreatePage
