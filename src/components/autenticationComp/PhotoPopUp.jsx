import { forwardRef, useRef } from "react";
import IconWithLabel from "../IconWithLabel"
import { LuImagePlus } from "react-icons/lu";
import { useBoxContext } from "../../contexts/BoxesContext";
import { AiOutlineClose } from "react-icons/ai";

const PhotoPopUp = forwardRef(({}, ref) => {

  const fileInputRef = useRef(null);
  const {toggleBox} = useBoxContext();

  const handleClick = () => {
    fileInputRef.current.click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(file) {
      console.log('the photo was chosen', file.name)
    }
  }

  return (
    <>
          <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    <div ref={ref} className="absolute z-50 left-10">
      <div className="pop-box shadow-md p-2">
        {/* <AiOutlineClose size={25} color="gray" className=" btn-bg " onClick={() => toggleBox('photo')}/> */}
      <IconWithLabel icon={LuImagePlus} text='Add from File' onClick={handleClick}/>
      
      </div>
      </div>
    </>

  )
})

export default PhotoPopUp
