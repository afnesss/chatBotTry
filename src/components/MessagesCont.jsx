import { forwardRef } from "react";
import Message from "./Message";

const MessagesCont = forwardRef(({messages, toUp}, containerRef) => {
  return (
    <div className='lg:px-5 md:px-1 py-5 lg:py-7 w-full shadow-md flex flex-col overflow-y-auto bg-gray-50 rounded-2xl my-3 h-full' ref={containerRef}>
    {messages.length > 0 ? 
    messages.map((msg, index) => {
      return (
        <Message key={index} 
        message={msg.message} 
        sender={msg.sender} 
        loading={msg.loading}/>
      )
    }
    
    ): 
    <div className={`text-gray-500 text-center px-3 w-full text-sm lg:text-base ${toUp || "mt-auto"}`}>Welcome to the chatbot project! Send a message using the textbox {toUp? "above": "below"}.</div>} 
    </div>
  )
})

export default MessagesCont
