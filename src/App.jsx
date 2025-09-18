import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ChatInput from '../ChatInput'
import Message from './Message'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <section className="flex justify-center min-h-screen">
      <div className="shadow-md container m-auto my-7 mx-10 bg-green-100 max-w-300 p-10 rounded-md">
        <div className="flex flex-col items-center">
        <ChatInput />
        <div className='my-7 w-full flex flex-col justify-between'>
          <Message message="heeloo" sender="robot" />
        <Message message="heeloo" sender="user" />
        
        </div>


        </div>
      </div>
    </section>

      
    </>
  )
}

export default App
