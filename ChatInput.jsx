
const ChatInput = () => {
  return (
    <>
    <div className="flex flex-row">
            <input
        className="border border-gray-400 px-3 py-1 rounded-xl bg-white w-200"
        placeholder="Send a message to Chatbot"
        size={30}
      />
      <button className="hover:bg-green-700 shadow-md px-3 py-1 rounded-xl bg-green-600 text-white font-semibold mx-5">
        Send
      </button>
    </div>

    </>

  );
};


export default ChatInput
