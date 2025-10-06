import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeNewChat, changeChatTitle, deleteChat } from "../utils/fetches";
import {v4 as uuidv4} from "uuid";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  const handleDeleteChat = async (chatId) => {
    await deleteChat(chatId);
    setChats(prev => prev.filter(item => item.id !== chatId));
    const newChatId = uuidv4();
    navigate(`/chats/${newChatId}`);
  }

  const handleNewChat = async () => {
    const newChat = await makeNewChat();
    navigate(`/chats/${newChat.id}`)
    setChats(prev => [newChat, ...prev]);
    return newChat;
  }

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("/api/chats/titles");
        const data = await res.json();
        setChats(data);
      } catch (error) {
        console.log('error fetching chats ' + error);
      }
  }
    fetchChats();
  }, [])

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
      setChats,
      handleNewChat,
      handleRename,
      handleDeleteChat
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
