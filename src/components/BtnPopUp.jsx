
const BtnPopUp = ({bg, title, icon: Icon, onClick}) => {
  return (
      <button onClick={onClick} className={`flex group items-center ${bg} w-full px-2 py-1 rounded-lg text-sm`}>
        <Icon size={15} className="mr-2"/>
        {title}
      </button>
  )
}

export default BtnPopUp
