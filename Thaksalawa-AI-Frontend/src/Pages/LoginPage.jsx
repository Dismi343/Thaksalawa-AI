import login from '../assets/Login.png'
import Register from '../assets/Register.png'
import {useState} from "react";
import { useNavigate } from "react-router-dom";


function LoginPage(){

    const navigate = useNavigate();

    const handleForgotPassword=()=>{
        navigate('/forgot-password');
    }

    const [isLogin,setIsLogin]=useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        remember: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit=()=>{
        console.log(isLogin ? 'Login with credentials:' :' Register with details:', formData);
        alert(`${isLogin ? 'Login' : 'Sign up'} submitted! Check console for data.`);
    }

    return (
        <>
        <div className="min-h-screen bg-primary w-full flex flex-col md:flex-row">
            <div className="md:w-1/2 w-full md:min-h-screen h-64 overflow-hidden p-6">
                {isLogin ? <img src={login} alt="login" className="w-full h-full object-cover rounded-3xl" /> :<img src={Register} alt="login" className="w-full h-full object-cover rounded-3xl" /> }

            </div>
            <div className="md:w-1/2 w-full md:min-h-screen flex-1 overflow-auto">
                <div className="flex flex-col justify-start md:justify-center items-start md:items-center p-6 md:p-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-[50px] font-bold text-darker">Thaksalawa AI</h1>
                    <div className="rounded-xl w-80 h-15 mt-10 shadow-lg bg-darker/50 flex p-3 ">
                        <button className={`h-full  w-1/2 rounded-xl text-white ${isLogin?'bg-darker':'bg-none'} `} onClick={()=>setIsLogin(true)}>Login</button>
                        <button className={`text-white w-1/2 h-full  rounded-xl ${isLogin?'bg-none':'bg-darker'} `} onClick={()=>setIsLogin(false)} >Register</button>
                    </div>
                    <div className='mt-10 text-lg text-dark'>Learn easy. Learn smart.</div>

                    <div className=" w-full mt-10 ">
                        <div className="flex flex-col">
                            {!isLogin &&(
                                <>
                                    <label htmlFor="email" className="block text-sm font-medium text-darker mb-4">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white"
                                        placeholder="Enter your email"
                                    />
                                </>
                            )}

                            <label htmlFor="username" className="block text-sm font-medium text-darker my-4">
                               Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white"
                                placeholder="Enter your Username"
                            />

                            <label htmlFor="password" className="block text-sm font-medium text-darker my-4">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white"
                                placeholder="Enter your password"
                            />
                            {!isLogin && (
                                <>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-darker my-4">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white"
                                        placeholder="Enter your confrim password"
                                    />
                                </>
                            )}

                            {isLogin && (
                                <div className="flex justify-between mt-10">
                                <span className="flex ">
                                     <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            // checked={formData.remember}
                                            // onChange={handleChange}
                                            className="w-4 h-4 text-dark border-darker rounded focus:ring-dark outline-none"
                                        />
                                        <span className="ml-2 text-dark">Remember me</span>
                                      </label>
                                </span>
                                    <span>
                                    <a className="hover:cursor-pointer text-dark" onClick={handleForgotPassword}>Forgot Password?</a>
                                </span>

                                </div>
                            )}

                            <div className="  w-full h-10 flex justify-end mt-10 ">

                                <button className="bg-light-yellow px-8 py-2 rounded-lg text-darker hover:cursor-pointer shadow-lg" onClick={handleSubmit}>
                                    {isLogin ?'Login':'Register'}
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
export default LoginPage;