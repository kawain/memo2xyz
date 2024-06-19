import { useState } from 'react'

function SearchForm ({ baseURL, setData }) {
  const [query, setQuery] = useState('')

  const handleSearch = async e => {
    e.preventDefault()
    try {
      const response = await fetch(`${baseURL}/index.php?q=${query}`)
      const data = await response.json()
      if (data.msg === 'ok') {
        setData(data.data)
      }
    } catch (error) {
      alert('エラーが発生しました: ' + error.message)
    }
  }

  return (
    <form className='search' onSubmit={handleSearch}>
      <input
        type='text'
        placeholder='検索キーワード'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </form>
  )
}

export default SearchForm
