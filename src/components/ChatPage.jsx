import React, { useState, useRef, useEffect } from 'react'
import { CiFaceSmile } from 'react-icons/ci'
import { FaFaceGrinBeam } from 'react-icons/fa6'

function ChatPage ({ baseURL, username }) {
  const systemUsername = { role: 'system', content: `ユーザー名: ${username}` }
  const [messages, setMessages] = useState([systemUsername])
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const userMessage = formData.get('userMessage')
    if (!userMessage.trim()) return

    const newUserMessage = { role: 'user', content: userMessage }
    setMessages(prevMessages => [...prevMessages, newUserMessage])
    formRef.current.reset()
    setIsLoading(true)

    try {
      const response = await fetch(`${baseURL}/chat.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: [...messages, newUserMessage] }),
        credentials: 'include'
      })
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      const newAssistantMessage = { role: 'assistant', content: data.response }
      setMessages(prevMessages => [...prevMessages, newAssistantMessage])
    } catch (error) {
      console.error('エラーの詳細:', error)
      alert('エラーが発生しました: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const convertNewlinesToBr = text => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <>
      <h2>
        チャット -{' '}
        <a href='https://groq.com/' target='_blank' rel='noopener noreferrer'>
          Groq API Model: llama3-70b-8192
        </a>
      </h2>
      <div className='message-container'>
        {messages.map(
          (msg, i) =>
            msg.role !== 'system' && (
              <div key={i} className={`message ${msg.role}`}>
                <div className='message-icon'>
                  {msg.role === 'user' ? <CiFaceSmile /> : <FaFaceGrinBeam />}
                </div>
                <div className='message-content'>
                  {convertNewlinesToBr(msg.content)}
                </div>
              </div>
            )
        )}
        {isLoading && (
          <div className='message assistant'>
            <div className='message-icon'>
              <FaFaceGrinBeam />
            </div>
            <div className='message-content'>考え中...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className='chat-form' ref={formRef}>
        <textarea wrap='off' name='userMessage' />
        <button type='submit' disabled={isLoading}>
          送信
        </button>
      </form>
      <button
        onClick={() => setMessages([systemUsername])}
        className='new-chat-btn'
      >
        新しいチャット
      </button>
    </>
  )
}

export default ChatPage
