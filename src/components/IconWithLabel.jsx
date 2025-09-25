
const iconStyles = 'hover:bg-gray-600/30 rounded-lg p-2 cursor-pointer';


const IconWithLabel = ({icon: Icon, text, sideBar, onClick }) => {
  return (
    <div onClick={onClick} className="flex flex-row items-center hover:bg-gray-600/30 rounded-lg cursor-pointer relative">
      <Icon className="p-2" size={37} color="green"/>
        <span
        className={`left-15 absolute
          ${sideBar ? "opacity-100" : "opacity-0"}
          transition-opacity duration-300
          overflow-hidden
          whitespace-nowrap text-sm text-gray-600`}
      >
        {text}
        </span>
    </div>
  )
}

export { iconStyles };
export default IconWithLabel;
