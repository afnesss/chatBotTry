import multer from "multer";
import {transliterate} from 'transliteration'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pics')
  },
  filename: (req, file, cb) => {
    const sanitized = transliterate(file.originalname).replace(/\s+/g, '-');
    const uniqueName = Date.now() + "-" + sanitized;
    
    cb(null, uniqueName);
  }
})

export const upload = multer({ storage });