import { TbLayoutSidebar } from "react-icons/tb";  
import { RiChatNewLine } from "react-icons/ri";     
import { FiSearch } from "react-icons/fi";  
import { FiSettings } from "react-icons/fi";   
import { FiLogIn } from "react-icons/fi";
import { MdMoreHoriz } from "react-icons/md";
import userIcon from "../assets/user.png";
import { NavLink, useNavigate} from "react-router-dom";
import React, { useState, useEffect, useRef} from "react";
import UserPopUp from "./autenticationComp/UserPopUp";
import { iconStyles } from "./IconWithLabel";
import IconWithLabel from "./IconWithLabel";

import { useChatMessages } from "../contexts/MessagesCnxtProvider";
// import { makeNewChat, changeChatTitle, deleteChat } from "../utils/fetches";

import EditChat from "./EditChat";

// import { FaRobot } from "react-icons/fa";
import { MdOutlineSmartToy } from "react-icons/md";
import SearchBox from '../components/SearchBox';
import { useChatContext } from "../contexts/ChatContext";
import { useAuthContext } from "../contexts/AuthContext";

const SideBar = () => {
  const [sideBar, setSideBar] = useState(false);
  
  const [hover, setHover] = useState(false);
  const [searchBox, setSearchBox] = useState(false);
  const [userBox, setUserBox] = useState(false);
  const [editChat, setEditChat] = useState({edit: false, chat: null, newTitle: ''});

  const ref = useRef(null);
  const refInput = useRef(null);
  const searchRef = useRef(null);
  const userPopRef = useRef(null);
  
  const {chats, handleNewChat, handleRename, handleDeleteChat, popEditChat, openPopUp, closePopUp} = useChatContext();
  const { currentUser, setPopAuth} = useAuthContext();

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
      if(userPopRef.current && !userPopRef.current.contains(e.target)){
        setUserBox(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // useEffect(() => {

  // }, [popAuth])

  const onRename = async () => {
    handleRename(editChat.chat.id, editChat.newTitle)
    setEditChat({ edit: false, chat: null, newTitle: "" });
  };

  return (
    <div
      className={`
        flex flex-col bg-green-50 p-3 h-[100dvh] relative
        ${sideBar ? "w-40 lg:w-60" : "w-16"}
        transition-[width] duration-300 ease-in-out max-sm:hidden
      `}>

      {searchBox && <SearchBox ref={searchRef} searchBox={searchBox} setSearchBox={setSearchBox}/>}
        {userBox && <UserPopUp close={() => setUserBox(false)} ref={userPopRef}/>}

          <button onClick={() => setSideBar (p => !p)} className="ml-auto mr-2 "
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
              {hover || sideBar ? 
              <TbLayoutSidebar className={`btn-bg cursor-ew-resize`} size={35} color='green'/>
            : <MdOutlineSmartToy className={`btn-bg cursor-ew-resize`} size={35} color='green'/>}  
          </button>

            <div className="mt-7">
            <IconWithLabel text="New Chat" sideBar={sideBar} icon={RiChatNewLine} onClick={handleNewChat}/>
            <IconWithLabel text="Find in Chat" sideBar={sideBar} icon={FiSearch} onClick={() => {setSearchBox(prev => !prev)}}/>
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
                        : <span className="w-full truncate block hover:overflow-visible hover:whitespace-normal text-sm lg:text-base mr-2"> 
                          {chat.title}
                        </span>}

                        <MdMoreHoriz onClick={(e)=> {e.preventDefault(); openPopUp(e, chat.id, 'sidebar'); }} className={`cursor-pointer opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity ${popEditChat.open && popEditChat.chatId === chat.id && "opacity-100"}`}/>
                      </NavLink>
                    {popEditChat.open && popEditChat.chatId === chat.id && popEditChat.from === 'sidebar' && <EditChat ref={ref} x={popEditChat.x} y={popEditChat.y} deleteChat={() => handleDeleteChat(chat.id)} changeChatTitle={() => 
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
            ?   <div className={`flex p-1 btn-bg ${sideBar ? " justify-start" : "items-center"} cursor-pointer`}
            onClick={() => setUserBox(p => !p)}>
              <img className={`w-7 h-7 rounded-full flex-shrink-0`} src={userIcon}/>
              {/* {console.log(currentUser)} */}
              <span className= {`mx-3 ${sideBar? "opacity-100" : "opacity-0"} transition-opacity duration-300 overflow-hidden whitespace-nowrap truncate block hover:overflow-visible hover:whitespace-normal`} >{currentUser?.name}</span>
            </div>
            : 
              <button className="btn-primary ml-2 cursor-pointer px-2 hover:bg-green-700" onClick={() =>{setPopAuth(true); setUserBox(false)}}>{sideBar? "Log in" : <FiLogIn size={15} className="text-white"/>}</button>
            }
        </div>

  )
}

export default SideBar
