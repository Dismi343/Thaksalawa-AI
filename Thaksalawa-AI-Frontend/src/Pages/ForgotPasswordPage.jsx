import forgotPassword from "../assets/forgotPassword.png";


function ForgotPasswordPage(){
    return (
        <>
            <div className="h-screen bg-white w-full flex flex-col md:flex-row ">
                <div className="rounded-3xl bg-white  w-full flex flex-col md:flex-row  ">
                    <div className="md:w-1/2 w-full md:min-h-screen  overflow-hidden ">
                        <img src={forgotPassword} alt="login" className="w-full h-full object-cover " />
                    </div>
                    <div className="md:w-1/2 w-full md:min-h-screen flex-1 overflow-auto flex items-center justify-center">
                        <div className="flex flex-col justify-start rounded-2xl md:justify-center items-start md:items-center p-6 md:p-10 max-w-2xl mx-auto bg-background  ">
                            <h1 className="text-3xl md:text-[50px] font-bold text-darker">Thaksalawa AI</h1>
                            <div className="rounded-xl w-80 h-10 mt-10 shadow-lg bg-gradient-to-r from-[#1E3231] to-[#458885] flex p-3 items-center justify-center text-white">
                                Forgot Password
                            </div>
                            <div className='mt-10 text-lg text-dark'>Enter the email address associated with your account.</div>
                            <div className=" w-full mt-10 ">
                                <div className="flex flex-col">
                                    <label htmlFor="username" className="block text-sm font-medium text-light-green my-4">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-3  rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition bg-white"
                                        placeholder="Enter your email"
                                    />

                                    <div className="  w-full h-10 flex justify-center mt-10 ">
                                        <button className="bg-light-yellow px-15 py-2 rounded-lg shadow-xl text-darker hover:cursor-pointer" >
                                            Submit
                                        </button>
                                    </div>

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