import { useState, useRef, useEffect } from 'react'

function ChatPage ({ baseURL }) {
  const [messages, setMessages] = useState([])
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

  return (
    <>
      <h2>チャット - Groq API</h2>
      <div className='message-container'>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className='message-icon'>
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className='message-content'>{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className='message assistant'>
            <div className='message-icon'>🤖</div>
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
    </>
  )
}

export default ChatPage
