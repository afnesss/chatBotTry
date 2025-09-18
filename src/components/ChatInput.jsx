import { useState } from "react";



const ChatInput = ({onSend}) => {
  const [inputText, setText] = useState('');

  const clickSend = () => {
    if (inputText.trim() === '') return;
    onSend(inputText);
    setText('');
  }

  return (
    <>
    <div className="flex flex-row w-full">
      <input
        className="border border-gray-400 px-3 py-2 rounded-xl bg-white w-full ml-5"
        placeholder="Send a message to Chatbot"
        value={inputText}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick = {clickSend} className="hover:bg-green-700 shadow-md px-5 py-2 rounded-xl bg-green-600 text-white font-semibold mx-5">
        Send
      </button>
    </div>

    </>

  );
};


export default ChatInput
