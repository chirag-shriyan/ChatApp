import { Backdrop, Button, Tooltip } from "@mui/material";
import { getGlobalState } from "../contexts/globalStateContext";
import { Close, MarkEmailRead, Email, LockReset } from "@mui/icons-material";
import { deleteUser, sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from 'react'
import ResetUserPassword from "./ResetUserPassword";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";


export default function MyAccount() {

    const {
        showMyAccount,
        setShowMyAccount,
        user,
        setSnackbar,
        promptForPassword,
        setPromptForPassword,
        setLoading,
    } = getGlobalState();

    const [showNewPassword, setShowNewPassword] = useState(false);

    function hideMyAccount() {
        const MyAccount = document.getElementById('MyAccount');
        (MyAccount as HTMLDivElement).classList.add('-translate-y-52');
        setShowMyAccount(false);
    }

    async function verifyEmail() {
        sendEmailVerification(user).then(() => {
            setSnackbar({ message: `Verification link is send to your email ${user.email}`, state: true, res: 'success' });
        }).catch(() => {
            setSnackbar({ message: `Too many request`, state: true, res: 'error' });
        });
    }

    async function DeleteUser() {
        if (!new RegExp('test').test(user.email)) {
            setLoading(30);
            await deleteDoc(doc(db, "ChatAppUsers", user.uid));
            deleteUser(user).then(() => {
                setShowMyAccount(false);
            });
            setLoading(100);
        }
        else {
            alert('You can not delete test accounts');
        }
    }


    useEffect(() => {
        if (promptForPassword.res === 'deleteUser') {
            DeleteUser();
            setPromptForPassword({ state: false });
        }
    }, [promptForPassword.res]);

    return (
        <>

            {showNewPassword && <ResetUserPassword setShowNewPassword={setShowNewPassword} />}

            <Backdrop
                open={showMyAccount}
                sx={{ color: '#fff', zIndex: '30' }}
                className='p-5'
            >

                <div id='MyAccount'
                    className='p-5 w-[500px] h-[400px] max-w-[500px] max-h-[500px] bg-[#19212c] flex flex-col items-center rounded-md
                        relative -top-32 duration-500 -translate-y-52 max-2xl:top-0'
                >

                    <div className='w-full mb-5 flex items-center justify-between'>

                        <h1 className='text-3xl'>My Account</h1>
                        <Close className='cursor-pointer' onClick={hideMyAccount} />

                    </div>



                    <div className='w-full space-y-8'>

                        <div className="space-y-2">
                            {user.emailVerified ?
                                <p className='text-sm text-[#9ca3aa]'>Your email is Verified</p>
                                :
                                <p className='text-sm text-[#9ca3aa]'>Verify your email</p>
                            }
                            <span className='flex justify-between items-center'>
                                <h1 className='text-xl'>{user.email && user.email}</h1>
                                {user.emailVerified ?
                                    <Tooltip title="Verified" arrow>
                                        <MarkEmailRead className='cursor-pointer' />
                                    </Tooltip>
                                    :
                                    <Tooltip title="Verify" arrow>
                                        <Email className='cursor-pointer' onClick={verifyEmail} />
                                    </Tooltip>
                                }
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className='text-sm text-[#9ca3aa]'>Reset your password</p>
                            <span className='flex justify-between items-center'>
                                <h1 className='text-3xl'>...................</h1>
                                <Tooltip title="Reset" arrow>
                                    <LockReset className='cursor-pointer' onClick={() => setShowNewPassword(true)} />
                                </Tooltip>
                            </span>
                        </div>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setPromptForPassword({
                                state: true,
                                title: 'Delete user',
                                text: 'This action can not be undone pleases enter your password to proceed',
                                from: 'deleteUser'
                            })}
                        >
                            Delete Account
                        </Button>


                    </div>


                </div>

            </Backdrop>


        </>
    )
}
