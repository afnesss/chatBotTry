import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { addMessage, changeChatTitle, chatExists, load} from '../utils/fetches';

import {generateAiClientStream, generateAiName, generateRes } from "../utils/aiFetches.js";
import { useChatContext } from "./ChatContext";
import { v4 as uuidv4 } from "uuid";

import { useParams} from 'react-router-dom';
import { useAuthContext } from './AuthContext';

export const useChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [controller, setController] = useState(null);
  const [loading, setLoading] = useState(false);
  const [botId, setBotId] = useState('');
  const [existingChat, setExistChat] = useState(null);
  const [toUp, setToUp] = useState(false);

  const {popAuth, currentUser} = useAuthContext();

  const confirmDelRef = useRef(null);
  const containerRef = useRef(null);
  const { id: chatId } = useParams();
  const firstMsg = useRef(true);
  // const [moreMsgs, setFirstMessages] = useState({});

    const { setChats, handleRename} = useChatContext();

  const resetChatState = () => {
    controller && controller.abort(); 
    setMessages([]);
    setExistChat(null);
    setBotId('');
    setLoading(false);
    setController(null);

};
  useEffect(() => {
    const handlecheck = async (chatId) => {
      const res = await chatExists(chatId)

    if (res && res.title) {
      setExistChat(res.title);
    } else {
      setExistChat(null);
    }
  

    }
  if (chatId && currentUser) { 
    load(chatId, setMessages);
    handlecheck(chatId);

  } else {
    setMessages([]);   
    setExistChat(null); 

  }
  firstMsg.current = true;
  }, [chatId, currentUser])



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
    const botMsg = { id: curBodId, chatId, sender: "robot", message: ""};

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
        console.log(firstMsg.current)
      if (messages.length < 2){
        const resName = await generateAiName(message, newController.signal);
        console.log('my log: '+chatId, resName?.response)
        if (!resName || !resName.response) {
        console.warn("AI name generation failed:", resName);}
        if (chatId && resName?.response) {
          await handleRename(chatId, resName.response);
        }
      }
      const res = await generateRes(message, newController.signal, true);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let boldChunk = false;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        let chunk = decoder.decode(value, { stream: true });
        
  
        chunk = chunk
          .split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line).response)
          .join('');

        
        chunk = chunk.replace(/ \* /g, '\n');
        // chunk = chunk.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        if (chunk.includes('**')){
          boldChunk = !boldChunk;
          chunk = chunk.replace(/\*\*/g, '');
        }
        if (boldChunk) {
          chunk = `<b>${chunk}</b>`;
        }

        fullText += chunk;
        // fullText = fullText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        setMessages(prev => 
          prev.map((msg) => {
  
           return msg.id === curBodId?
            {...msg, message: (msg.message || '') + chunk}
            : msg
          }
  
          )
        )
      }
  
      setMessages((prev) =>
        prev.map((msg) =>{
  
          return msg.id === curBodId ? { ...msg, message: fullText} : msg
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

    return {
      messages,
      resetChatState,
      handleSend,
      loading,
      controller,
      existingChat,
      // openConfirm,
      // setOpenConfirm,
      confirmDelRef,
      chatId,
      toUp,
      setToUp,
      containerRef,
  };
}
