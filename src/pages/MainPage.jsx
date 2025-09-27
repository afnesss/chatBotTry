import { useState, useRef, useEffect } from 'react'
import ChatInput from '../components/ChatInput'
import Message from '../components/Message'
import {v4 as uuidv4} from 'uuid';
import { useParams } from 'react-router-dom';
import { updateMsg, load } from '../utils/fetches';


const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [toUp, setToUp] = useState(false);
  const messagesRef = useRef(null);
  const containerRef = useRef(null);
  // const [combinedResponse, setCombRes] = useState('default');
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const [botId, setBotId] = useState('');

  const { id: chatId } = useParams();

  useEffect(() => {
    if(chatId){
      load(chatId, setMessages);
    }
  }, [chatId])

  const handleSend = async (message) => {

    if (loading){
      // setMessages(prev => prev.filter(item => item.id !== botId));
      // setBotId(null);
      setMessages(prev => {
        updateMsg(prev, chatId); // send latest
        return prev;
      });
      controller?.abort();
      return;
    }

    const curBodId = uuidv4();
    setBotId(curBodId);
    setMessages(prev => [
      ...prev,
      { chatId, id: uuidv4(), message, sender: "user"},
      { chatId, id: curBodId, sender: "robot", loading: true}
    ]);

    try {
      await fetchRes(message, curBodId);
    } catch (error) {
      console.log('error clicking:' + error)
    }
  };

  // const makeNewChat = () => {
  //   setMessages([]);
  // }

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
        .map(line => JSON.parse(line).response)
        .join('');

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
    setMessages(prev => {
      updateMsg(prev, chatId); // send latest
      return prev;
    });
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
    <section className="flex h-screen">
    
    {/* <LeftNav makeNewChat={makeNewChat}/> */}
      <div className="flex flex-col shadow-md bg-green-100 w-full p-7">
        <div className={`flex flex-col items-center mx-20 flex-1 overflow-y-auto mt-auto container max-w-250 mx-auto`}>
        {/* {toUp === true &&           
        <div className='mt-5 w-full mb-5'>
              <ChatInput onSend={handleSend} loading={loading} controller={controller} />
          </div>} */}
        <div className={`flex mt-5 w-full mb-5 ${toUp ? 'order-first' : 'order-last'}`}>
        <ChatInput onSend={handleSend} loading={loading} controller={controller}/>
      </div>

        <div className='px-5 py-7 w-full shadow-md flex flex-col overflow-y-auto h-173 bg-gray-50 rounded-2xl my-3 h-full' ref={containerRef}>
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

        {/* {toUp === false && (
          <div className='flex mt-5 w-full mb-5'>
              <ChatInput onSend={handleSend} loading={loading} controller={controller}/>
          </div> 
        )} */}
                        <button 
        onClick={() => setToUp(prev => !prev)} 
        className="text-center mt-auto text-green-600 underline hover:text-green-800 cursor-pointer">Move textbox to {toUp? "bottom": "top"}</button>


        </div>

</div>
    </section>
    </>
  )
}


export {MainPage as default}
