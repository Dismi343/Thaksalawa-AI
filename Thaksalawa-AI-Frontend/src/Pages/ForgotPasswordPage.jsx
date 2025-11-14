import login from "../assets/Login.png";
import Register from "../assets/Register.png";

function ForgotPasswordPage(){
    return (
        <>
            <div className="min-h-screen bg-primary w-full flex flex-col md:flex-row">
                <div className="md:w-1/2 w-full md:min-h-screen h-64 overflow-hidden p-6">
                    <img src={login} alt="login" className="w-full h-full object-cover rounded-3xl" />

                </div>
                <div className="md:w-1/2 w-full md:min-h-screen flex-1 overflow-auto">
                    <div className="flex flex-col justify-start md:justify-center items-start md:items-center p-6 md:p-10 max-w-2xl mx-auto">
                        <h1 className="text-3xl md:text-[50px] font-bold text-darker">Thaksalawa AI</h1>
                        <div className="rounded-xl w-80 h-10 mt-10 shadow-lg bg-darker flex p-3 items-center justify-center text-white">
                            Forgot Password
                        </div>
                            <div className='mt-10 text-lg text-dark'>Enter the email address associated with your account.</div>
                        <div className=" w-full mt-10 ">
                            <div className="flex flex-col">
                                <label htmlFor="username" className="block text-sm font-medium text-darker my-4">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white"
                                    placeholder="Enter your email"
                                />

                                <div className="  w-full h-10 flex justify-end mt-10 ">
                                    <button className="bg-light-yellow px-8 py-2 rounded-lg text-darker hover:cursor-pointer" >
                                      Submit
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
export default ForgotPasswordPage;