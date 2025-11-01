import { TbLayoutSidebar } from "react-icons/tb";  
import { RiChatNewLine } from "react-icons/ri";     
import { FiSearch } from "react-icons/fi";  
import { FiLogIn } from "react-icons/fi";
import { MdMoreHoriz } from "react-icons/md";
import userIcon from "../assets/user.png";
import { NavLink, useNavigate} from "react-router-dom";
import React, { useState, useEffect, useRef} from "react";

import IconWithLabel from "./IconWithLabel";

import { useChatMessages } from "../contexts/MessagesCnxtProvider";
import PhotoPopUp from "./autenticationComp/PhotoPopUp";
import EditChat from "./EditChat";

// import { FaRobot } from "react-icons/fa";
import { MdOutlineSmartToy } from "react-icons/md";

import { useChatContext } from "../contexts/ChatContext";
import { useAuthContext } from "../contexts/AuthContext";
import { useBoxContext } from "../contexts/BoxesContext";

// normalize backend URL from Vite env (remove trailing slash if present)
const BACKEND = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

const SideBar = () => {
  const [sideBar, setSideBar] = useState(false);
  
  const [hover, setHover] = useState(false);
  const {editChat, setEditChat, boxes, toggleBox, refs, closeBox, openBox, chatIdToDelete, setIdToDelete} = useBoxContext();
  
  const {chats, handleNewChat, handleRename, handleDeleteChat, popEditChat, openPopUp, closePopUp, setExistChat} = useChatContext();
  const { currentUser, setPopAuth} = useAuthContext();

  const onRename = async () => {
    handleRename(editChat.chat.id, editChat.newTitle)
    setEditChat({ edit: false, chat: null, newTitle: "" });
  };
// console.log(currentUser?.profile_pic)
  return (

    <>
      <button onClick={() => setSideBar (p => !p)} className="absolute left-2 top-1 sm:hidden z-50"
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}>
      {hover || sideBar ? 
      <TbLayoutSidebar className={`btn-bg cursor-ew-resize`} size={30} color='green'/>
    : <MdOutlineSmartToy className={`btn-bg cursor-ew-resize`} size={30} color='green'/>}  
    </button>
    <div
      className={`
        flex flex-col bg-green-50 p-3 h-[100dvh] sm:block sm:relative
          max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:z-50
          max-sm:w-60 max-sm:shadow-2xl
          max-sm:transform
          max-sm:transition-transform
          max-sm:duration-300
          max-sm:ease-in-out

        ${sideBar ? "w-40 lg:w-60 max-sm:translate-x-0" : "w-16 max-sm:-translate-x-full"}
        transition-[width] duration-300 ease-in-out sm:flex 
      `}>
      
      
          <button onClick={() => setSideBar (p => !p)} className="ml-auto mr-2 "
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
              {hover || sideBar ? 
              <TbLayoutSidebar className={`btn-bg cursor-ew-resize`} size={35} color='green'/>
            : <MdOutlineSmartToy className={`btn-bg cursor-ew-resize`} size={35} color='green'/>}  
          </button>

            <div className="mt-7">
            <IconWithLabel text="New Chat" sideBar={sideBar} icon={RiChatNewLine} onClick={handleNewChat}/>
            <IconWithLabel text="Find in Chat" sideBar={sideBar} icon={FiSearch} onClick={() => {toggleBox('search')}}/>
            </div>

            <div className={`mt-10 text-gray-600 text-sm lg:text-base transition-opacity duration-300 ${sideBar? "opacity-100" : "opacity-0"}`}>Your Chats</div>
            <div className={`flex-1 min-h-0 overflow-y-auto ${sideBar? "opacity-100" : "opacity-0"}`}>
              
                <div className="space-y-1 pb-2">
                  {/* {console.log("Chats:", chats.map(c => ({ id: c.id, title: c.title })))}  */}
                {chats.map((chat) => {
                  return (
                    <React.Fragment key={chat.id}>
                      <NavLink to={`/chats/${chat.id}`} className={({isActive}) => (`flex group justify-between items-center mt-2 hover:bg-gray-300/50 w-full p-2 rounded-xl 
                        ${popEditChat.open && popEditChat.chat === chat || editChat.edit && editChat.chat === chat && "bg-gray-300/50"} 
                        ${isActive && "bg-gray-300/30"}` )}>

                        {editChat.edit && editChat.chat === chat ? 
                            <input
                            ref = {refs.input}
                            type="text"
                            value={editChat.newTitle}
                            onChange={(e) => setEditChat(prev => ({ ...prev, newTitle: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") onRename();
                              if (e.key === "Escape") {
                                setEditChat({edit: false, chat: null, newTitle: ''});
                              }

                            }}
                            onClick={(e) => {e.preventDefault(); setExistChat(chat.title)}} 
                            autoFocus
                            className="focus:outline-none rounded-lg px-2 py-1 text-sm w-full"
                            />
                        : <span className="w-full truncate block hover:overflow-visible hover:whitespace-normal text-sm lg:text-base mr-2"> 
                          {chat.title}
                        </span>}

                        <MdMoreHoriz onClick={(e)=> {e.preventDefault(); openPopUp(e, chat.id, 'sidebar'); setExistChat(chat.title)}} className={`cursor-pointer opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity ${popEditChat.open && popEditChat.chatId === chat.id && "opacity-100"}`}/>
                      </NavLink>
                    {popEditChat.open && popEditChat.chatId === chat.id && popEditChat.from === 'sidebar' && <EditChat ref={refs.editChat} x={popEditChat.x} y={popEditChat.y} deleteChat={() => {setIdToDelete(chat.id); openBox('confirm')}} changeChatTitle={() => 
                          {setEditChat({ edit: true, chat, newTitle: chat.title });
                          closePopUp();
                          }}/>}
                    </React.Fragment>
                  )
                }
                )}
                </div>
            </div>

        <hr className={`border-t border-gray-200 my-2`}></hr>
            {currentUser 
            ?   <div 
            className={`flex p-1 btn-bg ${sideBar ? " justify-start" : "items-center"} cursor-pointer`}
            onClick={() => toggleBox('user')}>
              <img className={`w-7 h-7 rounded-full flex-shrink-0`} alt="profile" src={currentUser?.profile_pic ? `${import.meta.env.VITE_BACKEND_URL}${currentUser.profile_pic}` : userIcon} />
              {/* {console.log(currentUser)} */}
              <span 
              // contentEditable
              // suppressContentEditableWarning={true}
              className= {`mx-3 ${sideBar? "opacity-100" : "opacity-0"} transition-opacity duration-300 overflow-hidden whitespace-nowrap truncate block hover:overflow-visible hover:whitespace-normal`} >{currentUser?.name}</span>
            </div>
            : 
              <button className="btn-primary ml-2 cursor-pointer px-2 hover:bg-green-700" onClick={() =>{setPopAuth(true); closeBox('user')}}>{sideBar? "Log in" : <FiLogIn size={15} className="text-white"/>}</button>
            }
        </div>
</>
  )
}

export default SideBar
