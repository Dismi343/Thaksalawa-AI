import LoginPage from "./Pages/LoginPage.jsx";
import {Route, Routes} from "react-router-dom";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage.jsx";
import Sidebar from "./public/Sidebar.jsx";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
          <Route path='/dashboard' element={<Sidebar/>}/>
      </Routes>
    </>
  )
}

export default App
