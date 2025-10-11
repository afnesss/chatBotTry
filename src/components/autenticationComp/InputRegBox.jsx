import {FiEye, FiEyeOff} from "react-icons/fi";
import { useState } from "react";

const InputRegBox = ({icon: Icon, placeHolder, type, value, onChange, name}) => {
  const isPassword = type === 'password';
  const [show, setShow] = useState(false);



  return (
    <div className=" items-center ">
       <div className="relative w-full flex flex-row gap-5"> 
        <Icon size={20}/>
        <input
        name ={name}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
        type={isPassword? (show ? 'text' : 'password') : type}
        className=" input-style focus:ring-2 focus:ring-green-600/40 focus:outline-none"
        /> 

          {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="bg-transparent absolute right-3 inset-y-0 flex items-center cursor-pointer"
            aria-pressed={show}
            aria-label={show ? "Hide password" : "Show password"}
            // title={show ? "Hide password" : "Show password"}
          >
            {show ? <FiEye className="text-red-800/50"/> : <FiEyeOff className="text-red-800/50" />}
          </button>
        )}

      </div>

    </div>
  )
}

export default InputRegBox
