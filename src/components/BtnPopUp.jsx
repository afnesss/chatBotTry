
const BtnPopUp = ({bg, title, icon: Icon, onClick}) => {
  return (
      <button onClick={onClick} className={`flex group items-center ${bg} px-2 py-1 text-sm`}>
        {Icon &&  <Icon size={15} className="mr-2"/>}
        {title}
      </button>
  )
}

export default BtnPopUp
