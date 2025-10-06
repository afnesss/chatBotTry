import { TbLayoutSidebar } from "react-icons/tb";  
import { RiChatNewLine } from "react-icons/ri";     
import { FiSearch } from "react-icons/fi";  
import { FiSettings } from "react-icons/fi";   
import { MdMoreHoriz } from "react-icons/md";

import { NavLink, useNavigate} from "react-router-dom";
import React, { useState, useEffect, useRef} from "react";

import { iconStyles } from "./IconWithLabel";
import IconWithLabel from "./IconWithLabel";

import { makeNewChat, changeChatTitle, deleteChat } from "../utils/fetches";

import EditChat from "./EditChat";

// import { FaRobot } from "react-icons/fa";
import { MdOutlineSmartToy } from "react-icons/md";
import SearchBox from '../components/SearchBox';
import { useChatContext } from "../contexts/ChatContext";

const SideBar = () => {
  const [sideBar, setSideBar] = useState(false);
  const [popEditChat, setPopEditChat] = useState({ open: false, x: 0, y: 0, chat: null });
  const [hover, setHover] = useState(false);
  const [searchBox, setSearchBox] = useState(false);
  const [editChat, setEditChat] = useState({edit: false, chat: null, newTitle: ''});

  const ref = useRef(null);
  const refInput = useRef(null);
  const searchRef = useRef(null);
  
  const {chats, handleNewChat, handleRename, handleDeleteChat} = useChatContext();

  const openPopUp = (e, chat) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopEditChat (
      {
        open: true,
        x: rect.right-20,
        y: rect.top+20,
        chat
      }
    )
  }

  const closePopUp = () => {setPopEditChat({open: false, x: 0, y: 0, chat: null})};

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        console.log('clocked')
        closePopUp();
      }
      if(refInput.current && !refInput.current.contains(e.target)){
        setEditChat({edit: false, chat: null, newTitle: ''});
      }
      if(searchRef.current && !searchRef.current.contains(e.target)){
        setSearchBox(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const onRename = async () => {
    handleRename(editChat.chat.id, editChat.newTitle)
    setEditChat({ edit: false, chat: null, newTitle: "" });
  };

  return (
    <div
      className={`
        flex flex-col bg-green-50 p-3 h-[100dvh] relative
        ${sideBar ? "w-60" : "w-16"}
        transition-[width] duration-300 ease-in-out
      `}>

      {searchBox && <SearchBox ref={searchRef} onclick={() => setSearchBox(prev => !prev)}/>}

          <button onClick={() => setSideBar (p => !p)} className="ml-auto mr-2 "
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
              {hover || sideBar ? 
              <TbLayoutSidebar className={`hover:bg-gray-300/70 rounded-xl p-1 cursor-ew-resize`} size={35} color='green'/>
            : <MdOutlineSmartToy className={`hover:bg-gray-300/70 rounded-xl p-1 cursor-ew-resize`} size={35} color='green'/>}  
          </button>

            <div className="mt-7">
            <IconWithLabel text="New Chat" sideBar={sideBar} icon={RiChatNewLine} onClick={handleNewChat}/>
            <IconWithLabel text="Find in Chat" sideBar={sideBar} icon={FiSearch} onClick={() => setSearchBox(prev => !prev)}/>
            </div>

            <div className={`mt-10 text-gray-600 transition-opacity duration-300 ${sideBar? "opacity-100" : "opacity-0"}`}>Your Chats</div>
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
                            ref = {refInput}
                            type="text"
                            value={editChat.newTitle}
                            onChange={(e) => setEditChat(prev => ({ ...prev, newTitle: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") onRename();
                              if (e.key === "Escape") {
                                setEditChat({edit: false, chat: null, newTitle: ''});
                              }

                            }}
                            onClick={(e) => e.preventDefault()} 
                            autoFocus
                            className="focus:outline-none rounded-lg px-2 py-1 text-sm w-full"
                            />
                        : <span className="w-full truncate block hover:overflow-visible hover:whitespace-normal  mr-2"> 
                          {chat.title}
                        </span>}

                        <MdMoreHoriz onClick={(e)=> {e.preventDefault(); openPopUp(e, chat); }} className={`cursor-pointer opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity ${popEditChat.open && popEditChat.chat === chat && "opacity-100"}`}/>
                      </NavLink>
                    {popEditChat.open && popEditChat.chat === chat && <EditChat ref={ref} x={popEditChat.x} y={popEditChat.y} deleteChat={() => handleDeleteChat(chat.id)} changeChatTitle={() => 
                          {setEditChat({ edit: true, chat, newTitle: chat.title });
                          closePopUp();
                          }}/>}
                    </React.Fragment>
                  )
                }
                )}
                </div>
            </div>

          <div className="flex-shrink-0 pt-3">
            <FiSettings className={`${iconStyles} mt-auto`} size={40} color="green"/>
          </div>
        </div>

  )
}

export default SideBar
