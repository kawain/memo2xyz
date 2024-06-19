import { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function ArticleModal ({ baseURL, id, onClose }) {
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
  }, [])

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
            <div className='modal-header'>
              <h2>{data.title}</h2>
            </div>

            <div className='modal-body'>
              <pre>
                <code>{data.content}</code>
              </pre>
            </div>
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

export default ArticleModal
