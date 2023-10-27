import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGlobalState } from "../contexts/globalStateContext";
import { auth } from "../firebase";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { MdOutlineExpandMore } from 'react-icons/md'


export default function Login() {

    const Navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { setLoading }: any = getGlobalState();


    function nextInput(e: any) {
        e.preventDefault();

        const active = document.activeElement;
        const nextSibling = active?.nextElementSibling;

        if (nextSibling?.nextElementSibling) (nextSibling?.nextElementSibling as HTMLInputElement).focus();
    }

    function Login() {
        setError('');

        if (email && password !== '') {

            setLoading(30);
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    setLoading(100);
                    Navigate('/');
                })
                .catch((error) => {
                    setLoading(50);
                    setError(error.code);
                    setLoading(100);
                });

        }

    }

    // Only for test users
    function OneClickLogin(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) {
        setError('');

        const email = (e.target as HTMLHeadingElement).innerText;
        const password = 'test@123';

        if (email) {

            setLoading(30);
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    setLoading(100);
                    Navigate('/');

                })
                .catch((error) => {
                    setLoading(50);
                    setError(error.code);
                    setLoading(100);
                });

        }

    }

    return (
        <>
            <div className="min-w-screen max-w-full min-h-screen max-h-full flex p-4 items-center justify-center dark:bg-gray-800 dark:text-white">

                <div className="flex flex-col w-[400px] max-w-[400px] h-fit rounded-md relative top-[-8%] bg-gray-100 shadow-md shadow-gray-400  dark:bg-gray-700 dark:shadow-none p-6">

                    <h1 className="text-4xl my-5">Login In</h1>

                    <form className="flex flex-col justify-center" onSubmit={nextInput}>

                        <label htmlFor="email">Email</label>
                        <input autoFocus={true} type="text" id="email" className="my-3 p-1 py-[6px] px-2 rounded-md focus:outline-none focus:border-black border-gray-400 border-2 dark:bg-gray-600  dark:border-black dark:focus:border-white" placeholder="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" className="my-3 p-1 py-[6px] px-2 rounded-md focus:outline-none focus:border-black border-gray-400 border-2 dark:bg-gray-600  dark:border-black dark:focus:border-white" placeholder="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

                        <p className="relative px-1 top-[-5px] text-sm text-red-600">{error}</p>

                        <button type="button" className="bg-blue-600 text-white p-1 py-2 m-1 my-2 rounded-md" onClick={Login}>Login</button>
                        <button className="hidden"></button>


                    </form>

                    <p className="m-2 text-[#6b7176] w-fit text-sm">Don’t have an account yet? <Link to="/signup" className="text-[#2159eb] font-semibold hover:underline">Sign up here</Link></p>

                    {/* For the users to have a look of the app */}
                    <Accordion className="p-0 min-h-[20px] dark:bg-gray-700 border-black border text-white">
                        <AccordionSummary
                            expandIcon={<MdOutlineExpandMore className="text-3xl text-white" />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <p className="text-xl ">Some test accounts</p>
                        </AccordionSummary>

                        <AccordionDetails className="space-y-3">
                            <p className=" text-xl ">password for all test accounts is test@123</p>
                            <hr />
                            <h1 className=" text-2xl cursor-pointer hover:underline" onClick={OneClickLogin}>test@gmail.com</h1>
                            <h1 className=" text-2xl cursor-pointer hover:underline" onClick={OneClickLogin}>test2@gmail.com</h1>
                            <h1 className=" text-2xl cursor-pointer hover:underline" onClick={OneClickLogin}>test3@gmail.com</h1>
                            <h1 className=" text-2xl cursor-pointer hover:underline" onClick={OneClickLogin}>test4@gmail.com</h1>
                        </AccordionDetails>
                    </Accordion>
                </div>


            </div>

        </>
    )
}
