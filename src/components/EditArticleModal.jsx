import { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function EditArticleModal ({ baseURL, id, onClose, setUpdate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/index.php?id=${id}`)
        const data = await response.json()
        if (data.msg === 'ok') {
          setData(data.data)
        }
      } catch (error) {
        alert('エラーが発生しました: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleOverlayClick = event => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const title = formData.get('title')
    const content = formData.get('content')

    try {
      const response = await fetch(`${baseURL}/index.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, title, content }),
        credentials: 'include'
      })
      const data = await response.json()
      if (data.msg === 'ok') {
        setUpdate(pre => pre + 1)
        alert('更新しました')
      } else {
        alert('更新に失敗しました。')
      }
    } catch (error) {
      alert('エラーが発生しました: ' + error.message)
    }
  }

  return (
    <div className='modal' onClick={handleOverlayClick}>
      <div className='modal-content'>
        <div className='modal-close'>
          <button className='close-button' onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        <div className='modal-loading'>{loading ? 'Loading...' : ''}</div>
        {!data ? (
          ''
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className='modal-header'>
                <div>
                  <label htmlFor='title'>タイトル</label>
                  <input
                    type='text'
                    id='title'
                    name='title'
                    defaultValue={data.title}
                    required
                  />
                </div>
              </div>
              <div className='modal-body'>
                <label htmlFor='content'>内容</label>
                <textarea
                  wrap='off'
                  id='content'
                  name='content'
                  defaultValue={data.content}
                  required
                />
              </div>
              <button type='submit'>修正</button>
            </form>
          </>
        )}
        <div className='modal-close'>
          <button className='close-button' onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditArticleModal
