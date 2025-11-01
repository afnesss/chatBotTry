import { useAuthContext } from "../contexts/AuthContext";



const IconWithLabel = ({icon: Icon, text, sideBar=true, onClick }) => {
  const {currentUser} = useAuthContext();
  return (
    <div onClick={() => {currentUser && onClick()}} className={`flex flex-row items-center rounded-xl relative
    ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300/70 cursor-pointer"}`}>
      <Icon className="p-2 flex-shrink-0" size={37} color="green"/>
        <span
        className={`left-15
          ${sideBar ? "opacity-100" : "opacity-0"}
          transition-opacity duration-300
          overflow-hidden
          whitespace-nowrap text-xs lg:text-sm text-gray-600 mr-2`}
      >
        {text}
        </span>
    </div>
  )
}

export default IconWithLabel;
