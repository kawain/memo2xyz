import { useState, useEffect } from 'react'
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import ArticleModal from './ArticleModal'

function HomePage ({ baseURL, login }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [postID, setPostID] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/`)
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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const openModal = id => {
    setPostID(id)
  }

  const closeModal = () => {
    setPostID(null)
  }

  return (
    <>
      <h2>ホーム</h2>
      <table className='list'>
        <thead>
          <tr>
            <th>ID</th>
            <th>メモのタイトル</th>
            <th>閲覧</th>
            <th>編集</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {data.map((post, i) => (
            <tr key={i} className={i % 2 === 0 ? 'trCol' : ''}>
              <td className='td1'>{post.id}</td>
              <td>{post.title}</td>
              <td className='td3'>
                <button onClick={() => openModal(post.id)}>
                  <AiOutlineEye />
                </button>
              </td>
              <td className='td3'>
                <button disabled={!login}>
                  <AiOutlineEdit />
                </button>
              </td>
              <td className='td3'>
                <button disabled={!login}>
                  <AiOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {postID && (
        <ArticleModal baseURL={baseURL} id={postID} onClose={closeModal} />
      )}
    </>
  )
}

export default HomePage
