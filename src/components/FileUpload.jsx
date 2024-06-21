import { useState, useEffect } from 'react'
import { AiOutlineDownload, AiOutlineDelete } from 'react-icons/ai'

function FileUpload ({ baseURL, update, setUpdate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/upload.php`)
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

  const handleFileChange = e => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!file) {
      alert('ファイルを選択してください')
      return
    }

    const formData = new FormData()
    formData.append('fileToUpload', file)

    try {
      const response = await fetch(`${baseURL}/upload.php`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.msg === 'ok') {
        setUpdate(pre => pre + 1)
      } else {
        alert('エラーが発生しました: ' + data.error)
      }
    } catch (error) {
      alert('エラーが発生しました: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (id, fileName) => {
    const downloadUrl = `${baseURL}/upload.php?download=${id}`

    // リンク要素を作成
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName // ファイル名を指定
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async id => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        const response = await fetch(`${baseURL}/upload.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id })
        })

        const data = await response.json()

        if (data.msg === 'ok') {
          setUpdate(pre => pre + 1)
        } else {
          alert('削除中にエラーが発生しました: ' + data.error)
        }
      } catch (error) {
        alert('エラーが発生しました: ' + error.message)
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h2>ファイルアップロード</h2>
      <form onSubmit={handleSubmit} className='uploadForm'>
        <input type='file' onChange={handleFileChange} required />
        <button type='submit'>アップロード</button>
      </form>
      <table className='list'>
        <thead>
          <tr>
            <th>ID</th>
            <th>ファイル名</th>
            <th>ダウンロード</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {data.map((file, i) => (
            <tr key={i} className={i % 2 === 0 ? 'trCol' : ''}>
              <td className='td1'>{file.id}</td>
              <td>{file.name}</td>
              <td className='td3'>
                <button onClick={() => handleDownload(file.id, file.name)}>
                  <AiOutlineDownload />
                </button>
              </td>
              <td className='td3'>
                <button onClick={() => handleDelete(file.id)}>
                  <AiOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default FileUpload
