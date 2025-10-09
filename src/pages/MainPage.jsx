import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import ChatInput from '../components/ChatInput'
import {v4 as uuidv4} from 'uuid';
import { useParams} from 'react-router-dom';
import { addMessage, chatExists, load} from '../utils/fetches';
import { generateRes } from '../utils/aiFetches';
import MessagesCont from '../components/MessagesCont';
import { useChatContext } from '../contexts/ChatContext';
import { MdMoreHoriz } from 'react-icons/md';
import EditChat from '../components/EditChat';
import ConfirmDelete from '../components/ConfirmDelete';

const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [toUp, setToUp] = useState(false);

  const containerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const [botId, setBotId] = useState('');
  const ref = useRef(null);
  const confirmDelRef = useRef(null);
  
  const [openConfirm, setOpenConfirm] = useState(false);

  const { id: chatId } = useParams();
  const { setChats, openPopUp, closePopUp, popEditChat, handleDeleteChat, setPopEditChat} = useChatContext();
  const buttonRef = useRef(null);

  const [existingChat, setExistChat] = useState(null);

  useEffect(() => {
    const handlecheck = async (chatId) => {
      const res = await chatExists(chatId)
      // setExistChat(res.title);
      
          console.log("chatExists result:", res);
    if (res && res.title) {
      setExistChat(res.title);
    } else {
      setExistChat(null);
    }
  

    }
    if(chatId){
      load(chatId, setMessages);
      handlecheck(chatId);
    }
    // else{
    //   setMessages([]);
    //   // setChatId(null);
    //   setBotId(null);
    //   setController(null);
    //   setLoading(false);
    // }
  }, [chatId])

  useEffect(() =>
  {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        console.log('clocked')
        closePopUp();
      }
      if (confirmDelRef.current && !confirmDelRef.current.contains(e.target)) {
        setOpenConfirm(false);
      }
    }

      document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
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
    const botMsg = { id: curBodId, chatId, sender: "robot", message: "", loading: true };

    setMessages((prev) => [...prev, userMsg, botMsg]);


    const response = await addMessage(chatId, userMsg.sender, userMsg.message, userMsg.id);
    if(response.chatCreated){
      // console.log('response: '+ response.chat)
      setChats(prev => [...prev, response.chat]);
      
    }
    

    try {
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
      setMessages(prev => 
        prev.map((msg) => {

         return msg.id === curBodId?
          {...msg, message: (msg.message || '') + chunk, loading: true}
          : msg
        }

        )
      )
    }

    setMessages((prev) =>
      prev.map((msg) =>{

        return msg.id === curBodId ? { ...msg, message: fullText, loading: false } : msg
      }));

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

  useEffect(() => {
  const handleResize = () => {
    if (popEditChat.open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = popEditChat.from === 'main' ? rect.left - 100 : rect.right - 20;
      const y = rect.top + 20;

      setPopEditChat(prev => ({
        ...prev,
        x,
        y
      }));
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [popEditChat.open, popEditChat.from]);

  return (
    <>
    <section className="flex h-screen">

      <div className="flex flex-col shadow-md bg-green-100 w-full p-7">
        {existingChat && 
          <div className='relative inline-block'>

          <MdMoreHoriz  ref={buttonRef} size={40} className=' text-gray-600 hover:bg-gray-300/50 rounded-xl ml-auto p-2' onClick={(e) => {openPopUp(e, chatId, 'main', buttonRef)}}/>
          {popEditChat.open && popEditChat.chatId === chatId && popEditChat.from === 'main' && <EditChat ref={ref} x={popEditChat.x} y={popEditChat.y} isPersonal={true}  deleteChat={() => /*handleDeleteChat(chatId)}*/ setOpenConfirm(true)}/>}
        </div>
        }
        {openConfirm && <ConfirmDelete title={existingChat} cancelDel={() => setOpenConfirm(false)} deleteChat={() => {handleDeleteChat(chatId); setOpenConfirm(false);}} ref={confirmDelRef}/>}

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
