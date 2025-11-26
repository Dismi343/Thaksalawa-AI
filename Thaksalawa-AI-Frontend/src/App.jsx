import LoginPage from "./Pages/LoginPage.jsx";
import {Route, Routes} from "react-router-dom";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage.jsx";
import Sidebar from "./public/Sidebar.jsx";
import Studentdashboard from "./Pages/StudentDashboard.jsx";
//import QuizPage from "./Pages/QuizPage.jsx";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='/dashboard' element={<Sidebar/>}/>
        <Route path='/studentdashboard' element={<Studentdashboard/>}/>
        
      </Routes>
    </>
  )
}

export default App
