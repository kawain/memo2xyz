import { useState, useEffect } from 'react'
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import SearchForm from './SearchForm'
import ArticleModal from './ArticleModal'
import EditArticleModal from './EditArticleModal'

function HomePage ({ baseURL, login, update, setUpdate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [postID, setPostID] = useState(null)
  const [modalMode, setModalMode] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/index.php`)
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
  }, [update])

  const openModal = (id, mode) => {
    setModalMode(mode)
    setPostID(id)
  }

  const closeModal = () => {
    setPostID(null)
    setModalMode('')
  }

  const handleDelete = async id => {
    if (window.confirm('本当に削除しますか？')) {
      setLoading(true)
      try {
        const response = await fetch(`${baseURL}/index.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })
        const data = await response.json()
        if (data.msg === 'ok') {
          setUpdate(pre => pre + 1)
        } else {
          alert('削除に失敗しました。')
        }
      } catch (error) {
        alert('エラーが発生しました: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h2>ホーム</h2>
      <SearchForm baseURL={baseURL} setData={setData} />
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
                <button onClick={() => openModal(post.id, 'get')}>
                  <AiOutlineEye />
                </button>
              </td>
              <td className='td3'>
                <button
                  onClick={() => openModal(post.id, 'put')}
                  disabled={!login}
                >
                  <AiOutlineEdit />
                </button>
              </td>
              <td className='td3'>
                <button onClick={() => handleDelete(post.id)} disabled={!login}>
                  <AiOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {postID && (
        <>
          {modalMode === 'get' && (
            <ArticleModal baseURL={baseURL} id={postID} onClose={closeModal} />
          )}
          {modalMode === 'put' && (
            <EditArticleModal
              baseURL={baseURL}
              id={postID}
              onClose={closeModal}
              setUpdate={setUpdate}
            />
          )}
        </>
      )}
    </>
  )
}

export default HomePage
