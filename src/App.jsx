
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import MainPage from './pages/MainPage'

function App() {
  // const [count, setCount] = useState(0)
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
        <Route index element={<MainPage />}/>
        <Route path = 'chats/:id' element={<MainPage />}/>
    </Route>
  ));

    return <RouterProvider router={router}/>;
}

export default App
