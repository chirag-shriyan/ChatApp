import { updatePassword } from "firebase/auth";
import { getGlobalState } from "../contexts/globalStateContext";
import { useState, useEffect } from 'react'


export default function ResetUserPassword(props: any) {

    const {
        setLoading,
        user,
        setShowMyAccount,
        promptForPassword,
        setPromptForPassword,
        setSnackbar,
        setUpdatingPage
    } = getGlobalState();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError]: any = useState();

    function nextInput(e: any) {
        e.preventDefault();
        const active = document.activeElement;
        const nextSibling = active?.nextElementSibling;
        if (nextSibling?.nextElementSibling) (nextSibling?.nextElementSibling as HTMLInputElement).focus();
    }

    function showReAuth(e: any) {
        e.target.blur();
        setError('');
        if (newPassword !== '') {
            if (confirmPassword === newPassword) {
                if (!new RegExp('test').test(user.email)) {
                    setPromptForPassword({
                        state: true,
                        text: 'Enter your old password',
                        from: 'ResetUserPassword'
                    });
                }
                else {
                    alert(`You can not change the test account's password`);
                }
            }
            else {
                setTimeout(function () {
                    setError('new password and confirm new password should be same');
                }, 100);
            }

        }

    }

    function resetPassword() {
        if (!new RegExp('test').test(user.email)) {
            setError('');
            setShowMyAccount(false);
            updatePassword(user, newPassword).then(() => {
                props.setShowNewPassword(false);
                setPromptForPassword({ res: null });
            }).catch((e: any) => {
                setLoading(30);
                setError(e.code);
                setLoading(100);
            });
        }
        else {
            alert(`You can not change the test account's password`);
        }

    }

    useEffect(() => {
        if (promptForPassword.res === 'ResetUserPassword') {
            setUpdatingPage(true);
            resetPassword();
            setTimeout(function () {
                setUpdatingPage(false);
                setSnackbar({ message: `Your password is successfully updated`, state: true, res: 'success' });
            }, 1000);
        }
    }, [promptForPassword.res])


    return (

        <>

            <div className="w-screen h-screen flex p-4 items-center justify-center dark:bg-gray-800 dark:text-white absolute z-50">

                <div className="flex flex-col w-[400px] max-w-[400px] h-[450px] max-h-[450px] rounded-md relative top-[-8%] bg-gray-100 shadow-md shadow-gray-400 dark:bg-gray-700 dark:shadow-none p-6">

                    <h1 className="text-4xl my-5">Reset Password</h1>

                    <form className="flex flex-col justify-center" onSubmit={nextInput}>

                        <label htmlFor="newPassword">New password</label>
                        <input autoFocus={true} type="password" id="newPassword" className="my-3 p-1 py-[6px] px-2 rounded-md focus:outline-none focus:border-black border-gray-400 border-2 dark:bg-gray-600  dark:border-black dark:focus:border-white" placeholder="new password" autoComplete="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                        <label htmlFor="confirmPassword">Confirm New password</label>
                        <input type="password" id="confirmPassword" className="my-3 p-1 py-[6px] px-2 rounded-md focus:outline-none focus:border-black border-gray-400 border-2 dark:bg-gray-600  dark:border-black dark:focus:border-white" placeholder="confirm new password" autoComplete="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        <p className="relative px-1 top-[-5px] text-sm text-red-600">{error}</p>

                        <button
                            type="button"
                            className="bg-blue-600 text-white p-1 py-2 m-1 my-2 rounded-md"
                            onClick={(e) => showReAuth(e)}
                        >
                            Reset Password
                        </button>
                        <button
                            type="button"
                            className="bg-red-600 text-white p-1 py-2 m-1 my-2 rounded-md"
                            onClick={() => props.setShowNewPassword(false)}
                        >
                            Cancel
                        </button>
                        <button className="hidden"></button>


                    </form>

                </div>


            </div >
        </>

    )
}
