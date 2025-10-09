import {useRef, useEffect} from 'react'
import ChatInput from '../components/ChatInput'

import MessagesCont from '../components/MessagesCont';
import { useChatContext } from '../contexts/ChatContext';
import { MdMoreHoriz } from 'react-icons/md';
import EditChat from '../components/EditChat';
import ConfirmDelete from '../components/ConfirmDelete';

import { useChatMessages } from '../contexts/MessagesContext';

const MainPage = () => {

  const ref = useRef(null);

  const {openPopUp, closePopUp, popEditChat, handleDeleteChat, setPopEditChat} = useChatContext();
  const {messages, handleSend, loading, controller, existingChat, openConfirm, setOpenConfirm, confirmDelRef, chatId, toUp, setToUp, containerRef} = useChatMessages();

  const buttonRef = useRef(null);


  useEffect(() =>
  {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        closePopUp();
      }
      if (confirmDelRef.current && !confirmDelRef.current.contains(e.target)) {
        setOpenConfirm(false);
      }
    }

      document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

          <MdMoreHoriz  ref={buttonRef} size={35} className=' text-gray-600 hover:bg-gray-300/50 rounded-xl ml-auto p-2' onClick={(e) => {openPopUp(e, chatId, 'main', buttonRef)}}/>
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
