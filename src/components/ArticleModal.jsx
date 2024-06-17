import { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function ArticleModal ({ baseURL, id, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/index.php?id=${id}`)
        const data = await response.json()
        setData(data)
        setLoading(false)
      } catch (error) {
        setError(error)
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
        <div className='modal-header'>
          {loading ? 'Loading...' : ''}
          {error ? 'Error: ' + error.message : ''}
          {!data ? (
            ''
          ) : (
            <>
              <h2>{data.title}</h2>
              <button className='close-button' onClick={onClose}>
                <AiOutlineClose />
              </button>
            </>
          )}
        </div>
        <div className='modal-body'>
          <pre>
            <code>{!data ? '' : data.content}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ArticleModal
