
const BtnPopUp = ({bg, title, icon: Icon, onClick, color}) => {
  return (
      <button onClick={onClick} className={`flex group items-center ${bg} px-2 py-1 text-sm`}>
        {Icon &&  <Icon size={color? 20: 15} className={`mr-2 ${color}`}/>}
        {title}
      </button>
  )
}

export default BtnPopUp
