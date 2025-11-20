import  login from '../assets/login.png'
import Register from '../assets/Register.png'
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
        role: '',
        remember: false

    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordmatch, setPasswordmatch] = useState(true);

    const validatePassword = (pw) => {
        if (!pw || pw.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter.';
        if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter.';
        if (!/[0-9]/.test(pw)) return 'Password must include a number.';
        if (!/[!@#\$%\^&\*\(\)\-_\+=\[\]\{\};:"\\|,.<>\/\?]/.test(pw)) return 'Password must include a special character.';
        return '';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'password') setPasswordError('');

    };

    const handleSubmit= async()=> {
        console.log(isLogin ? 'Login with credentials:' : ' Register with details:', formData);

        if(isLogin){
            try{
                const res = await axios.post('http://127.0.0.1:8000/auth/login',{
                    username: formData.username,
                    password: formData.password
                },
                    {
                        headers: {"Content-Type": "application/json"}
                    }
                    )
                console.log(res.data);
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    role: '',
                    remember: false
                });
            }catch(e){
                console.error("Login error:", e);
                return null;
            }
        }

        if (!isLogin) {
            const pwError = validatePassword(formData.password);
            if (pwError) {
                setPasswordError(pwError);
                return;
            }
                if (formData.password !== confirmPassword) {
                    setPasswordmatch(false);
                    return;
                }
                try {
                    const res = await axios.post('http://127.0.0.1:8000/users/register',
                        {
                            username: formData.username,
                            email: formData.email,
                            password: formData.password,
                            role: formData.role,
                            remember: formData.remember
                        },
                        {
                            headers: {"Content-Type": "application/json"}
                        }
                    )
                    console.log(res.data);
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                        role: '',
                        remember: false
                    });
                    setConfirmPassword('');
                } catch (e) {
                    console.error("Registration error:", e);
                    return null;
                }
            }

        }

    return (
        <>
        <div className="min-h-screen bg-background w-full flex flex-col md:flex-row">
            <div className="md:w-1/2 w-full h-sceen overflow-hidden ">
                {isLogin ? <img src={login} alt="login" className="w-full h-full object-cover" /> :<img src={Register} alt="register" className="w-full h-full object-cover " /> }

            </div>
            <div className="md:w-1/2 w-full h-full flex-1 overflow-auto">
                <div className="flex flex-col justify-start md:justify-center items-start md:items-center p-6 md:p-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-[50px] font-bold text-primary">Thaksalawa AI</h1>
                    <div className={`rounded-xl w-80 h-15 mt-10 shadow-xl flex p-3 ${isLogin?'bg-gradient-to-r from-[#1E3231] to-[#458885]':'bg-gradient-to-r from-[#458885] to-[#1E3231]'} `}>
                        <button className={`h-full  w-1/2 rounded-xl text-white  ${isLogin?'bg-darker shadow-sm':'bg-none'} `} onClick={()=>setIsLogin(true)}>Login</button>
                        <button className={`text-white w-1/2 h-full  rounded-xl ${isLogin?'bg-none':'bg-darker shadow-sm'} `} onClick={()=>setIsLogin(false)} >Register</button>
                    </div>
                    <div className='mt-8 text-2xl font-semibold text-light-green'>Learn easy. Learn smart.</div>

                    <div className=" w-full mt-10 ">
                        <div className="flex flex-col">
                            {!isLogin &&(
                                <>
                                    <label htmlFor="email" className="block text-sm font-medium text-light-green mb-4">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white/50"
                                        placeholder="Enter your email"
                                    />

                                    <label htmlFor="usertype" className="block text-sm font-medium text-light-green my-4">
                                        User Type
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white/50 text-gray-500"
                                    >
                                        <option value="" >Select user type</option>
                                        <option value="Student" >Student</option>
                                        <option value="Teacher" >Teacher</option>
                                    </select>
                                </>
                            )}

                            <label htmlFor="username" className="block text-sm font-medium text-light-green my-4">
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
                            <label htmlFor="password" className="block text-sm font-medium text-light-green my-4">
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
                            {passwordError && (
                                <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                            )}
                            {!isLogin && (
                                <>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-green my-4">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e)=>setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white"
                                        placeholder="Enter your confrim password"
                                    />
                                    {passwordError && (
                                        <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                                    )}
                                    {!passwordmatch && (
                                        <p className="text-sm text-red-500 mt-2">Password does not match </p>
                                    )}
                                </>
                            )}

                            {isLogin && (
                                <div className="flex justify-between mt-10">
                                <span className="flex ">
                                     <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                             checked={formData.remember}
                                             onChange={handleChange}
                                            className="w-4 h-4 text-dark border-darker rounded focus:ring-dark outline-none"
                                        />
                                        <span className="ml-2 text-light-green font-semibold">Remember me</span>
                                      </label>
                                </span>
                                    <span>
                                    <a className="hover:cursor-pointer text-light-green font-semibold" onClick={handleForgotPassword}>Forgot Password?</a>
                                </span>

                                </div>
                            )}

                            <div className="  w-full h-10 flex justify-end mt-10 ">
                                <button className="bg-gradient-to-r from-gradient-start to-gradient-end px-8 py-2 rounded-lg text-white font-semibold hover:cursor-pointer shadow-lg" onClick={handleSubmit}>
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