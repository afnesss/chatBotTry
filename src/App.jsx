import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ChatInput from './components/ChatInput'
import Message from './components/Message'

function App() {
  // const [count, setCount] = useState(0)
  const [messages, setMessages] = useState([]);
  const [toUp, setToUp] = useState(false);
  const messagesRef = useRef(null);
  const containerRef = useRef(null);
  // const [activeScroll, setActiveScroll] = useState(false);

  const handleSend = async (message) => {
  setMessages(prev => [...prev, { message, sender: "user" }]);

  const res = await fetch("http://localhost:11434/api/generate",{
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      model: "gemma:2b",
      prompt: message
    }
    )
  })

  const data = await res.text();
  const combinedResponse = data
  .split("\n")
  .filter(line => line.trim())          // remove empty lines
  .map(line => JSON.parse(line).response) // parse each line
  .join("");


  setMessages(prev => [...prev, { message: combinedResponse, sender: "robot" }]);

  };

  useEffect(() => {
    const div = containerRef.current;
    if (div.scrollHeight > div.clientHeight) {
       messagesRef.current?.scrollIntoView({behavior: "smooth"});
    }

  }, [messages]);

  return (
    <>
    <section className="flex justify-center min-h-screen">
      <div className="flex flex-col shadow-md container m-auto my-7 mx-10 bg-green-100 max-w-300 p-7 rounded-md">
        <div className="flex flex-col items-center mx-20 flex-1 overflow-y-auto">
        {toUp === true &&           
        <div className=' w-full mb-5'>
              <ChatInput onSend={handleSend} />
          </div>}
        <div className='px-5 py-7 w-full flex flex-col overflow-y-auto h-173 bg-gray-50 rounded-2xl' ref={containerRef}>
        {messages.length > 0 ? 
        messages.map((msg, index) => {
          const isLast = index === messages.length - 1;
          return (
            <Message key={index} 
            message={msg.message} 
            sender={msg.sender} 
            ref = {isLast? messagesRef : null}/>
          )
        }

        ): 
        <div className={`text-gray-500 text-center w-full ${toUp || "mt-auto"}`}>Welcome to the chatbot project! Send a message using the textbox {toUp? "above": "below"}.</div>} 

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
