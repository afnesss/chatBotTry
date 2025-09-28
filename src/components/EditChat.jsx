// import { MdEdit } from "react-icons/md";
import { forwardRef } from "react";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

const EditChat = forwardRef(({x, y}, ref) => {
  console.log(x, y);
  return (
    <div ref={ref} className="fixed shadow-md rounded-xl bg-gray-200 p-2 gap-2" style={{ top: y, left: x }}>
      <button  className="flex group items-center hover:bg-gray-400/30 w-full px-2 py-1 rounded-lg text-sm">
        <FiEdit3  size={15} className="mr-2"/>
        Rename
      </button>
      <hr className="mx-auto m-1 border-t border-gray-400 max-w-[70%]"></hr>
        <button  className="flex group items-center hover:bg-red-500/10 w-full px-2 py-1 rounded-lg text-sm text-red-700">
        <FiTrash2 size={15} className="mr-2"/>
        Delete
      </button>
    </div>
  )
})

export default EditChat
