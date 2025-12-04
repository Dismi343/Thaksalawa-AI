import LoginPage from "./Pages/LoginPage.jsx";
import {Route, Routes} from "react-router-dom";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage.jsx";
import Sidebar from "./public/Sidebar.jsx";
import Studentdashboard from "./Pages/StudentDashboard.jsx";
//import QuizPage from "./Pages/QuizPage.jsx";
import Home from "./Pages/Home.jsx";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='/dashboard' element={<Sidebar/>}/>
        <Route path='/studentdashboard' element={<Studentdashboard/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>
    </>
  )
}

export default App
