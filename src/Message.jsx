
const Message = ({message, sender}) => {
  return (
    <div className="flex flex-row w-full mb-5">
      {sender === 'robot' && (
        <img src="src/assets/robot.png" width='50'/>
        )}
      {message}
      {sender === 'user' && (
        <img src="src/assets/user.png" width='50'/>
        )}
    </div>
  )
}

export default Message
