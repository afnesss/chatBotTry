import { useState, useRef, useEffect } from 'react'
import ChatInput from './components/ChatInput'
import Message from './components/Message'
import {v4 as uuidv4} from 'uuid';

function App() {
  // const [count, setCount] = useState(0)
  const [messages, setMessages] = useState([]);
  const [toUp, setToUp] = useState(false);
  const messagesRef = useRef(null);
  const containerRef = useRef(null);
  // const [combinedResponse, setCombRes] = useState('default');
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const [botId, setBotId] = useState('');

  const handleSend = async (message) => {

    if (loading){
      setMessages(prev => prev.filter(item => item.id !== botId));
      setBotId(null);
      controller?.abort();
      return;
    }

    const curBodId = uuidv4();
    setBotId(curBodId);
    setMessages(prev => [
      ...prev,
      { message, sender: "user"},
      { id: curBodId, sender: "robot", loading: true}
    ]);

    try {
        const response = await fetchRes(message, curBodId);
    } catch (error) {
      console.log('error clicking:' + error)
    }
  };


  useEffect(() => {
    const div = containerRef.current;
    if (div.scrollHeight > div.clientHeight) {
       messagesRef.current?.scrollIntoView({behavior: "smooth"});
    }

  }, [messages]);

  const fetchRes = async (message, curBodId) => {
    const newController = new AbortController();
    setController(newController);
    setLoading(true);
    try {

      const res = await fetch("http://localhost:11434/api/generate",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          model: "gemma:2b",
          prompt: message
        }),
        signal: newController.signal
    })

    // const data = await res.text();
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      let chunk = decoder.decode(value, { stream: true });

      chunk = chunk
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line).response);

      fullText += chunk;
      setMessages(prev => 
        prev.map(msg => 
          msg.id === curBodId?
          {...msg, message: (msg.message || '') + chunk, loading: true}
          : msg
        )
      )
    }
    // setMessages(prev => prev.map(msg => msg.id === curBodId
    //   ? {...msg, message: fullText, loading: false, showAnim: false}
    //   : msg
    // ));

    return fullText;

    } catch (error) {
      
      if(error.name === "AbortError"){
        console.log("canceled fetch");
        return;
      }
      console.log('error in fetching '+ error);
    } finally{
      setLoading(false);
      setController(null);
    }
  }

  return (
    <>
    <section className="flex justify-center min-h-screen">
      <div className="flex flex-col shadow-md container m-auto my-7 mx-10 bg-green-100 max-w-300 p-7 rounded-md">
        <div className="flex flex-col items-center mx-20 flex-1 overflow-y-auto">
        {toUp === true &&           
        <div className=' w-full mb-5'>
              <ChatInput onSend={handleSend} loading={loading} controller={controller} />
          </div>}
        <div className='px-5 py-7 w-full flex flex-col overflow-y-auto h-173 bg-gray-50 rounded-2xl' ref={containerRef}>
        {messages.length > 0 ? 
        messages.map((msg, index) => {
          const isLast = index === messages.length - 1;
          return (
            <Message key={index} 
            message={msg.message} 
            sender={msg.sender} 
            loading={msg.loading}
            ref = {isLast? messagesRef : null}/>
          )
        }
        
        ): 
        <div className={`text-gray-500 text-center w-full ${toUp || "mt-auto"}`}>Welcome to the chatbot project! Send a message using the textbox {toUp? "above": "below"}.</div>} 

        </div>
        {toUp === false && (
          <div className='mt-auto w-full mb-5'>
              <ChatInput onSend={handleSend} loading={loading} controller={controller}/>
          </div> 
        )}
        
        </div>
        <button 
        onClick={() => setToUp(prev => !prev)} 
        className="text-center mt-auto text-green-600 underline hover:text-green-800 cursor-pointer">Move textbox to {toUp? "bottom": "top"}</button>
      </div>
    </section>
    </>
  )
}

export default App
