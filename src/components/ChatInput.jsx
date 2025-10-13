import { useState } from "react";


const ChatInput = ({onSend, loading}) => {
  const [inputText, setText] = useState('');

  const clickSend = () => {
    if (inputText.trim() === '' && !loading) return;
    onSend(inputText);
    setText('');
  }
  return (
    <>
    <div className="flex flex-row w-full">
      <input
        className="border border-gray-400 px-3 py-2 rounded-xl bg-white w-full lg:ml-5 text-sm lg:text-base"
        placeholder="Send a message to Chatbot"
        value={inputText}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {if (e.key === 'Enter') clickSend()}}
      />
      <button disabled = {!inputText.trim() && !loading} onClick = {clickSend} className={`btn-primary lg:mx-5 mx-2 ${!inputText.trim() && !loading ? "opacity-80 cursor-not-allowed" : "hover:bg-green-700"}`}>
        {loading? "Stop" : "Send"}
      </button>
    </div>

    </>

  );
};


export default ChatInput
