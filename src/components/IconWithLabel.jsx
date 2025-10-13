import { useAuthContext } from "../contexts/AuthContext";

const iconStyles = 'hover:bg-gray-300/70 rounded-xl p-2 cursor-pointer';


const IconWithLabel = ({icon: Icon, text, sideBar, onClick }) => {
  const {currentUser} = useAuthContext();
  return (
    <div onClick={() => {currentUser && onClick()}} className={`flex flex-row items-center rounded-xl relative
    ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300/70 cursor-pointer"}`}>
      <Icon className="p-2" size={37} color="green"/>
        <span
        className={`left-15 absolute
          ${sideBar ? "opacity-100" : "opacity-0"}
          transition-opacity duration-300
          overflow-hidden
          whitespace-nowrap text-xs lg:text-sm text-gray-600`}
      >
        {text}
        </span>
    </div>
  )
}

export { iconStyles };
export default IconWithLabel;
