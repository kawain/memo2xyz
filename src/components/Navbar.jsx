function Navbar ({ currentPage, setCurrentPage, login, setLogin }) {
  return (
    <nav className='navbar'>
      <div className='nav-brand'>
        <h1>メモ２</h1>
      </div>
      <div className='nav-item'>
        <button
          onClick={() => setCurrentPage('homePage')}
          disabled={currentPage === 'homePage'}
        >
          ホームに戻る
        </button>

        {!login ? (
          <button
            onClick={() => setCurrentPage('loginPage')}
            disabled={currentPage === 'loginPage'}
          >
            ログイン
          </button>
        ) : (
          <>
            <button
              onClick={() => setCurrentPage('createPage')}
              disabled={currentPage === 'createPage'}
            >
              新規作成
            </button>

            <button
              onClick={() => {
                setCurrentPage('homePage')
                setLogin(false)
              }}
            >
              ログアウト
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
