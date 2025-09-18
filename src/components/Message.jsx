
const Message = ({message, sender}) => {
  return (
    <div className={`flex flex-row w-full mb-5 ${sender === 'robot'? "justify-start" : "justify-end"}`}>
      {sender === 'robot' && (
        <img className="mx-5" src="src/assets/robot.png" width='50'/>
        )}
        <div className="px-3 py-2 bg-gray-200 text-center flex items-center rounded-md shadow-md">
          {message}
        </div>
      {sender === 'user' && (
        <img className="mx-5" src="src/assets/user.png" width='50'/>
        )}
    </div>
  )
}

export default Message
