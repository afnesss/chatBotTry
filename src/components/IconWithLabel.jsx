
const iconStyles = 'hover:bg-gray-600/30 rounded-lg p-2 cursor-pointer opacity-100';


const IconWithLabel = ({icon: Icon, text, sideBar }) => {
  return (
    <div className="flex flex-row items-center">
      <Icon className={iconStyles} size={37} color="green"/>
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
