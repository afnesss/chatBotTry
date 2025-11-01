import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeNewChat, changeChatTitle, deleteChat } from "../utils/fetches";
import {v4 as uuidv4} from "uuid";
import { useAuthContext } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  const [chats, setChats] = useState([]);
  const [popEditChat, setPopEditChat] = useState({ open: false, x: 0, y: 0, chatId: null, from: null });
  const navigate = useNavigate();
  const {popAuth, currentUser} = useAuthContext();
  const [existingChat, setExistChat] = useState(null);
  const [currChatTitle, setCurrChatTitle] = useState('');

  const handleDeleteChat = async (chatId, currentChatId) => {
    await deleteChat(chatId);
    setChats(prev => prev.filter(item => item.id !== chatId));
    if(chatId === currentChatId){
      handleNewChat();
    }

  }

  const handleNewChat = async () => {
    const newChatId = uuidv4();
    navigate(`/chats/${newChatId}`)
  }


  const openPopUp = (e, chatId, from, buttonRef = null) => {
    let rect = null;
    buttonRef && buttonRef.current ? 
     rect = buttonRef.current.getBoundingClientRect()
     : rect = e.currentTarget.getBoundingClientRect();
    let x;
    from === 'main' ? x= rect.left-100 : x = rect.right-20
    setPopEditChat (
      {
        open: true,
        x,
        y: rect.top+20,
        chatId,
        from
      }
    )
  }

  const closePopUp = () => {setPopEditChat({open: false, x: 0, y: 0, chatId: null})};

  
  useEffect(() => {
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('/api/chats/titles', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      setChats(data);

    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };
  const token = localStorage.getItem("token");
  if (token) {
    fetchChats();
  } else{
    setChats([]);
  }
  // console.log(currentUser);
  }, [currentUser])

  const handleRename = async (chatId, newTitle) => {
    if (!newTitle.trim()) return;

    await changeChatTitle(chatId, newTitle.trim());

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat
      )
    );

    // setEditChat({ edit: false, chat: null, newTitle: "" });
  };
  
  return (
    <ChatContext.Provider value = {{
      chats,
      popEditChat,
      setChats,
      setPopEditChat,
      handleNewChat,
      handleRename,
      handleDeleteChat,
      openPopUp,
      closePopUp,
      existingChat,
      setExistChat,
      currChatTitle, 
      setCurrChatTitle
    }}>
      { children }
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context){
    throw new Error('useChatContext must be used within ChatProvider');
  }

  return context;
}
