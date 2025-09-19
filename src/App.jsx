import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ChatInput from './components/ChatInput'
import Message from './components/Message'

// const clickSend = (text) => {
//   return (
//     <>
//     <Message message={text} sender="user"/>
//     </>
//   )
// }

function App() {
  // const [count, setCount] = useState(0)
  const [messages, setMessages] = useState([]);
  const [toUp, setToUp] = useState(true);

    const handleSend = (message) => {
    setMessages(prev => [...prev, { message, sender: "user" }]);

    setMessages(prev => [...prev, { message: "reply", sender: "robot" }]);

  };

  return (
    <>
    <section className="flex justify-center min-h-screen">
      <div className="flex flex-col shadow-md container m-auto my-7 mx-10 bg-green-50 max-w-300 p-10 rounded-md">
        <div className="flex flex-col items-center mx-20 flex-1 overflow-y-auto">
        {toUp === true && <ChatInput onSend={handleSend}/>}
        <div className='my-7 w-full flex flex-col justify-between '>
          {/* <Message message="heeloo" sender="robot" />
        <Message message="heeloo" sender="user" /> */}
        {messages.map((msg, index) => (<Message key={index} message={msg.message} sender={msg.sender}/>)
        )}

        </div>
        {toUp === false && (
          <div className='mt-auto w-full mb-5'>
              <ChatInput onSend={handleSend} />
          </div>
              
        )}
        
        </div>
        <button onClick={() => setToUp(prev => !prev)} className='text-center mt-auto text-green-600 underline hover:text-green-800 cursor-pointer'>Move textbox to {toUp? "bottom": "top"}</button>
      </div>
    </section>

      
    </>
  )
}

export default App
