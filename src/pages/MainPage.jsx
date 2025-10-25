import {useRef, useEffect, useState} from 'react'
import ChatInput from '../components/ChatInput'

import MessagesCont from '../components/MessagesCont';
import { useChatContext } from '../contexts/ChatContext';
import { MdMoreHoriz } from 'react-icons/md';
import EditChat from '../components/EditChat';
import ConfirmDelete from '../components/ConfirmDelete';

import { useChatMessages } from '../contexts/MessagesCnxtProvider';
import RegisterForm from '../components/autenticationComp/RegisterForm';
import { useAuthContext } from '../contexts/AuthContext';
import { useBoxContext } from '../contexts/BoxesContext';
// import UserPopUp from '../components/autenticationComp/UserPopUp';


const MainPage = () => {

  // const ref = useRef(null);
  
  const {openPopUp, closePopUp, popEditChat, handleDeleteChat, setPopEditChat} = useChatContext();
  const {messages, handleSend, loading, controller, existingChat, chatId, toUp, setToUp, containerRef} = useChatMessages();
  const {boxes, refs, toggleBox, closeBox, openBox, chatIdToDelete, setIdToDelete} = useBoxContext();
  const {currentUser, setPopAuth, popAuth} = useAuthContext();

  const buttonRef = useRef(null);
  
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
    <section className="flex h-screen relative">

      {/* <EditProfile /> */}
      {popAuth && <RegisterForm setPopAuth={setPopAuth}/>}
      <div className="flex flex-col shadow-md bg-main w-full p-5 lg:p-7">
        {existingChat && 
          <div className='flex ml-auto absolute right-3 top-3'>
            <div className='inline-block'>
          <MdMoreHoriz  ref={buttonRef} size={35} className='lg:opacity-100 text-gray-600 btn-bg ml-auto p-2 max-sm:opacity-0 md:opacity-0 sm:opacity-0' onClick={(e) => {openPopUp(e, chatId, 'main', buttonRef)}}/>
          {popEditChat.open && popEditChat.chatId === chatId && popEditChat.from === 'main' && <EditChat ref={refs.editChat} x={popEditChat.x} y={popEditChat.y} isPersonal={true}  deleteChat={() => {setIdToDelete(chatId); openBox('confirm')}}/>}

            </div>
          
        </div>
        }

        {boxes.confirm && <ConfirmDelete title={existingChat} cancelDel={() => closeBox('confirm')} deleteChat={() => {handleDeleteChat(chatIdToDelete, chatId); closeBox('confirm');}} ref={refs.confirm}/>}

        <div className={`flex flex-col items-center flex-1 overflow-y-auto mt-auto container max-w-250 mx-auto`}>
          <div className={`flex my-3 w-full ${toUp ? 'order-first' : 'order-last'}`}>
            <ChatInput onSend={handleSend} loading={loading} controller={controller}/>
          </div>

          <MessagesCont messages={messages} toUp={toUp} ref={containerRef}/>
          <button 
          onClick={() => setToUp(prev => !prev)} 
          className="link-primary order-last">Move textbox to {toUp? "bottom": "top"}
          </button>

        </div>

      </div>
    </section>
    </>
  )
}


export {MainPage as default}
