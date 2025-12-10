import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { 
 
  X, 
  AlertCircle,
} from 'lucide-react';
import axios from "axios";

export default function LoginModal({ isOpen, onClose, initialMode = 'login' }){
    const navigate = useNavigate(); 
    const [isLogin, setIsLogin] = useState(true);
    
    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        remember: false
    });
    
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsLogin(initialMode === 'login');
            setApiError('');
            setPasswordError('');
            setFormData(prev => ({ ...prev, password: '' })); // Clear password on re-open
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    // --- Logic ---
    const handleForgotPassword = () => {
        onClose(); 
        navigate('/forgot-password');
    };

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
        console.log(formData);
        if (name === 'password') setPasswordError('');
        if (apiError) setApiError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setIsLoading(true);

        if (isLogin) {
            try {
                // REAL API CALL
                
                const res = await axios.post('http://localhost:8080/user/login', {
                    email: formData.email,
                    password: formData.password
                }, { headers: { "Content-Type": "application/json" } });

                console.log(res.data);
                const token = res.data.access_token;
                localStorage.setItem("token", token);

                // ⭐ NOW Call dashboard to get user info
                const userRes = await axios.get("http://localhost:8080/user/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const user = userRes.data;
                console.log("USER:", user);

                await new Promise(resolve => setTimeout(resolve, 1000));
                
                if (user.role === "student") navigate("/studentdashboard");
                else if (user.role === "teacher") navigate("/teacherdashboard");
                else if (user.role === "admin") navigate("/admindashboard");
                console.log("user:", user.profile.name);
                onClose();
            } catch (e) {
                console.error("Login error:", e);
                setApiError('Invalid username or password.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Register Logic
            const pwError = validatePassword(formData.password);
            if (pwError) {
                setPasswordError(pwError);
                setIsLoading(false);
                return;
            }
            if (formData.password !== confirmPassword) {
                setPasswordMatch(false);
                setIsLoading(false);
                return;
            }

            try {
                let apiUrl = "";
                let payload = {};

                if (formData.role == 1) {
                    // STUDENT
                    apiUrl = "http://127.0.0.1:8000/students/create";
                    payload = {
                        st_name: formData.username,
                        email: formData.email,
                        password: formData.password,
                        role_id: formData.role
                    };
                } 
                
                else if (formData.role == 2) {
                    // TEACHER
                    apiUrl = "http://127.0.0.1:8000/teachers/create_teacher";
                    payload = {
                        name: formData.username,
                        email: formData.email,
                        password: formData.password,
                        role_id: formData.role
                    };
                }

                const res = await axios.post(apiUrl, payload, {
                    headers: { "Content-Type": "application/json" }
                });

                console.log("REGISTER RESPONSE:", res.data);

                await new Promise(resolve => setTimeout(resolve, 1000));

                setIsLogin(true); 
                alert("Registration successful! Please login.");
                setApiError("");

            } catch (e) {
                console.error("Registration error:", e);
                setApiError("Registration failed. Try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10 text-slate-500"
                >
                    <X size={20} />
                </button>

                <div className="p-8 pt-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[#1a4d2e]">Thaksalawa AI</h2>
                        <p className="text-slate-500 mt-2 text-sm">Learn easy. Learn smart.</p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="bg-slate-100 p-1.5 rounded-xl flex mb-8 relative">
                         {/* Sliding Background Animation */}
                        <div 
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
                        ></div>
                        
                        <button 
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg relative z-10 transition-colors ${isLogin ? 'text-[#1a4d2e]' : 'text-slate-500'}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button 
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg relative z-10 transition-colors ${!isLogin ? 'text-[#1a4d2e]' : 'text-slate-500'}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Register
                        </button>
                    </div>

                    {/* API Error Message */}
                    {apiError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                            <AlertCircle size={16} />
                            {apiError}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {!isLogin && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent outline-none transition-all"
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a4d2e] outline-none transition-all text-slate-600"
                                        required
                                    >
                                        <option value="">Select user type</option>
                                        <option value={1}>Student</option>
                                        <option value={2}>Teacher</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent outline-none transition-all"
                                placeholder="student@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${passwordError ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-[#1a4d2e]'}`}
                                placeholder="••••••••"
                                required
                            />
                            {passwordError && <p className="text-xs text-red-500 mt-1 ml-1">{passwordError}</p>}
                        </div>

                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${!passwordMatch ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-[#1a4d2e]'}`}
                                    placeholder="••••••••"
                                    required
                                />
                                {!passwordMatch && <p className="text-xs text-red-500 mt-1 ml-1">Passwords do not match</p>}
                            </div>
                        )}

                        {/* Remember Me & Forgot Password */}
                        {isLogin && (
                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.remember ? 'bg-[#1a4d2e] border-[#1a4d2e]' : 'border-slate-300 bg-white'}`}>
                                        {formData.remember && <Check size={14} className="text-white" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        name="remember" 
                                        checked={formData.remember} 
                                        onChange={handleChange} 
                                        className="hidden" 
                                    />
                                    <span className="text-sm text-slate-500 group-hover:text-[#1a4d2e] transition-colors">Remember me</span>
                                </label>
                                <button type="button" onClick={handleForgotPassword} className="text-sm font-bold text-[#1a4d2e] hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-[#1a4d2e] text-white font-bold py-4 rounded-xl mt-6 hover:bg-[#143d24] transition-all shadow-lg shadow-green-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
