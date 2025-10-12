import jwt from "jsonwebtoken";


const authenticate = (req, res, next) => {
  //зберігаєм токен з хеадерс
  const token = req.headers.authorization?.split(" ")[1];
  //якщо не токен то статус 401 неавторизовано
  if(!token) {return res.status(401).json({ error: "Unauthorized" })};
  //пробуєм верифікувати токен за допомогою сікрет
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }

}

export default authenticate