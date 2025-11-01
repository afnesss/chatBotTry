import { createContext, useContext } from "react";
import { useChatMessages as useChatMessagesLogic } from "./MessagesContext"; 

const MessagesContext = createContext();

export const MessagesProvider = ({children}) => {
  const value = useChatMessagesLogic();
  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

export const useChatMessages = () => useContext(MessagesContext);
