import { forwardRef, useEffect, useRef, useState } from "react";
import IconWithLabel from "../IconWithLabel"
import { LuImagePlus, LuCamera} from "react-icons/lu";
import { MdAddAPhoto } from "react-icons/md";
import { useBoxContext } from "../../contexts/BoxesContext";
import { AiOutlineClose } from "react-icons/ai";



const PhotoPopUp = forwardRef(({set, setPic}, ref) => {

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const {toggleBox} = useBoxContext();
 

  const handleClick = (ref) => {
    ref.current.click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      console.log('the photo was chosen', file.name)
      const localPreview = URL.createObjectURL(file);
      setPic(file);
      set(prev => ({ ...prev, profile_pic: localPreview }));
    }
  }

  useEffect(() => {
    setPic(null)
  }, [])

  return (
    <>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden"/>
      <input type="file" accept="image/*" ref={cameraInputRef} onChange={handleFileChange} capture='user' className="hidden"/>

    <div ref={ref} className="absolute z-50 left-10">
      <div className="pop-box p-2">
        {/* <AiOutlineClose size={25} color="gray" className=" btn-bg " onClick={() => toggleBox('photo')}/> */}
      <IconWithLabel icon={LuImagePlus} text='Add from File' onClick={() => handleClick(fileInputRef)}/>
      <IconWithLabel icon={LuCamera} text='Take a photo' onClick={() => navigator.mediaDevices.getUserMedia({ video: true })}/>
      
      </div>
      </div>
    </>

  )
})

export default PhotoPopUp;
