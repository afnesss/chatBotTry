import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import ChatInput from '../components/ChatInput'
import {v4 as uuidv4} from 'uuid';
import { useParams} from 'react-router-dom';
import { addMessage, generateRes, load, makeNewChat } from '../utils/fetches';
import MessagesCont from '../components/MessagesCont';
// import { handleNewChat } from '../components/SideBar';
import { useChatContext } from '../contexts/ChatContext';

const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [toUp, setToUp] = useState(false);

  // const messagesRef = useRef(null);
  const containerRef = useRef(null);

  // const [combinedResponse, setCombRes] = useState('default');
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const [botId, setBotId] = useState('');

  const { id: chatId } = useParams();
  const { setChats, handleNewChat } = useChatContext();

  // const [currentChatId, setCurrentChatId] = useState(paramChatId || null);

  useEffect(() => {
    if(chatId){
      load(chatId, setMessages);
    }
    else{
      setMessages([]);
      // setChatId(null);
      setBotId(null);
      setController(null);
      setLoading(false);
    }
  }, [chatId])

  useLayoutEffect(() => {
  const container = containerRef.current;
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }
  }, [messages]);

  const handleSend = async (message) => {

    if (loading){

      controller?.abort();
    const botMessage = messages.find(msg => msg.id === botId);
    
    if (botMessage && botMessage.message) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botId ? { ...msg, loading: false } : msg
        )
      );
      
    }
      try {

        await addMessage(chatId, botMessage.sender, botMessage.message, botMessage.id, true);
      } catch (error) {
        console.log('Error saving aborted message:', error);
      }
    setBotId(null);
      return;
    }

    const curBodId = uuidv4();
     setBotId(curBodId);

    const userMsg = { id: uuidv4(), chatId, sender: "user", message };
    // console.log(currChatId);
    const botMsg = { id: curBodId, chatId, sender: "robot", message: "", loading: true };
    // console.log("botmsg: "+botMsg)
    // await new Promise(r => setTimeout(r, 50)); //костиль2
    setMessages((prev) => [...prev, userMsg, botMsg]);


    const response = await addMessage(chatId, userMsg.sender, userMsg.message, userMsg.id);
    if(response.chatCreated){
      // console.log('response: '+ response.chat)
      setChats(prev => [...prev, response.chat]);
    }
    

    try {
      // if (isNewChat) {
      //   await load(currChatId, setMessages);
      // }
      await fetchRes(message, curBodId, chatId);


    } catch (error) {
      console.log('error clicking:' + error)
    }
  };

  const fetchRes = async (message, curBodId, chatId) => {
    const newController = new AbortController();
    setController(newController);
    setLoading(true);
    try {
    const res = await generateRes(message, newController.signal);
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
      // console.log(fullText);
      setMessages(prev => 
        prev.map((msg) => {
          // console.log(msg.id , curBodId);
         return msg.id === curBodId?
          {...msg, message: (msg.message || '') + chunk, loading: true}
          : msg
        }

        )
      )
      // console.log(messages, curBodId);
    }

    setMessages((prev) =>
      prev.map((msg) =>{
        // console.log(msg.id , curBodId);
        return msg.id === curBodId ? { ...msg, message: fullText, loading: false } : msg
      }
        
      )
    );

    await addMessage(chatId, "robot", fullText, curBodId, true);
    console.log('Bot повідомлення збережено для chatId:', chatId);
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
          <div className={`flex mt-5 w-full mb-5 ${toUp ? 'order-first' : 'order-last'}`}>
            <ChatInput onSend={handleSend} loading={loading} controller={controller}/>
          </div>

          <MessagesCont messages={messages} toUp={toUp} ref={containerRef}/>
          <button 
          onClick={() => setToUp(prev => !prev)} 
          className="text-center mt-auto text-green-600 underline hover:text-green-800 cursor-pointer order-last">Move textbox to {toUp? "bottom": "top"}
          </button>

        </div>

      </div>
    </section>
    </>
  )
}


export {MainPage as default}
