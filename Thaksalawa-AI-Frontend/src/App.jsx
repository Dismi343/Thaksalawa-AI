import LoginPage from "./Pages/LoginPage.jsx";
import {Route, Routes} from "react-router-dom";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage.jsx";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
      </Routes>
    </>
  )
}

export default App
