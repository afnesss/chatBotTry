// import { FiTrash2 } from "react-icons/fi"
import { forwardRef } from "react"
import BtnPopUp from "./BtnPopUp"

const btnStyle = "border border-t border-gray-400 mx-2 rounded-full px-3"
const ConfirmDelete = forwardRef(({deleteChat, cancelDel, title}, ref) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div ref={ref} className="pop-box w-100">
        <div className="text-gray-600 font-semibold">Delete this Chat?</div>
        <div className="text-gray-600 text-sm my-3">Chat <span className="font-semibold">{title}</span> will be deleted</div>
        <div className="ml-auto flex flex-row justify-end">
          <BtnPopUp onClick={cancelDel} bg={`hover:bg-gray-300 text-gray-600 ${btnStyle}`} title="Cancel"/>
          <BtnPopUp onClick={deleteChat} bg={`hover:bg-red-600 bg-red-400 text-white ${btnStyle}`} title="Delete"/>
        
        </div>

      </div>
    </div>
  )
})

export default ConfirmDelete
