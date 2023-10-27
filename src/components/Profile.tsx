import { Avatar, Backdrop, Input, Tooltip } from '@mui/material'
import { getGlobalState } from '../contexts/globalStateContext'
import { Close, Edit, CameraAlt } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { updateEmail, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
    const {
        showProfile,
        setShowProfile,
        user,
        setLoading,
        setUpdatingPage,
        promptForPassword,
        setPromptForPassword
    } = getGlobalState();

    const [uploadingImage, setUploadingImage]: any = useState(null);
    const [usernameValue, setUsernameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [emailError, setEmailError] = useState(null);

    const filesUpload: any = useRef();
    const usernameEdit: any = useRef();
    const emailEdit: any = useRef();

    //Backdrop bg- #00000080

    function hideProfile() {
        const Profile = document.getElementById('Profile');
        (Profile as HTMLDivElement).classList.add('-translate-y-52');
        setShowProfile(false);
    }

    async function updateProfilePic() {
        if (uploadingImage) {
            setUpdatingPage(true);
            setLoading(30);
            const imageRef = ref(getStorage(), `/ChatApp/Profile pics/${user.uid}`);

            await uploadBytes(imageRef, uploadingImage);
            setLoading(40);

            updateProfile(user, { photoURL: await getDownloadURL(imageRef) }).then(async () => {
                setLoading(50);
                setUploadingImage(null);
                await updateDoc(doc(db, "ChatAppUsers", user.uid), {
                    photoURL: await getDownloadURL(imageRef),
                });
                setLoading(100);
                setTimeout(() => {
                    setUpdatingPage(false);
                }, 50);
            });


        }
    }

    useEffect(() => {
        if (uploadingImage !== null) {
            updateProfilePic();
        }
    }, [uploadingImage]);

    async function updateUsername(e: any) {
        e.preventDefault();
        if (!new RegExp('test').test(user.email)) {
            if (usernameValue !== '') {
                setUpdatingPage(true);
                usernameEdit.current.children[0].blur();

                setLoading(30);
                await updateProfile(user, { displayName: usernameValue });
                await updateDoc(doc(db, "ChatAppUsers", user.uid), {
                    displayName: user.displayName,
                });
                setLoading(100);
                setTimeout(() => {
                    setUpdatingPage(false);
                }, 50);

            }
        }
        else {
            alert(`You can not change the test account's username`);
            setUsernameValue(user.displayName)
        }
    }

    async function updateUserEmail() {
        if (!new RegExp('test').test(user.email)) {
            setEmailError(null)
            setUpdatingPage(true);
            emailEdit.current.children[0].blur();
            setLoading(30);
            updateEmail(user, emailValue).then(() => {
                setLoading(100);
                setTimeout(() => {
                    setUpdatingPage(false);
                }, 50);

            }).catch((e) => {
                setLoading(100);
                setTimeout(() => {
                    setUpdatingPage(false);
                }, 50);
                setEmailError(e.code);
                emailEdit.current.children[0].focus();

            });
        }
        else {
            alert(`You can not change the test account's email`);
            setEmailValue(user.email)
        }

    }


    function reAuthUser(e: any) {
        e.preventDefault();
        if (emailValue !== '') {
            setPromptForPassword({
                state: true,
                title: 'Change your Email',
                text: 'To change your email address confirm your password',
                from: 'updateUserEmail'
            });
        }
    }

    useEffect(() => {
        if (promptForPassword.res === 'updateUserEmail') {
            updateUserEmail();
            setPromptForPassword({ state: false });
        }
    }, [promptForPassword.res]);



    useEffect(() => {
        if (user.displayName && user.email) {
            setUsernameValue(user.displayName);
            setEmailValue(user.email);
        }
    }, [user]);

    return (
        <>

            <input type="file" ref={filesUpload} className='hidden' onChange={(e) => setUploadingImage(e.target.files![0])} />

            <Backdrop
                open={showProfile}
                sx={{ color: '#fff', zIndex: '30' }}
                className='p-5'
            >

                <div id='Profile' className='p-5 w-[500px] h-[500px] max-w-[500px] max-h-[500px] bg-[#19212c] flex flex-col items-center rounded-md
                relative -top-16 duration-500 -translate-y-52 max-2xl:top-0'>

                    <div className='w-full mb-5 flex items-center justify-between'>

                        <h1 className='text-3xl'>Profile</h1>
                        <Close className='cursor-pointer' onClick={hideProfile} />

                    </div>

                    <div>
                        {/* Overlay */}
                        <div className='flex flex-col items-center justify-center hover:z-10 hover:bg-[#00000080] w-32 h-32 rounded-full absolute hover:cursor-pointer duration-200' onClick={() => filesUpload.current.click()}>
                            <CameraAlt />
                            <p>Change</p>
                            <p>Profile Photo</p>
                        </div>

                        {/* Profile Photo */}
                        <Avatar
                            className="w-32 h-32 text-7xl pointer-events-none"
                            style={{ background: user.photoURL && user.photoURL }}
                            src={user.photoURL && user.photoURL}
                        >
                            {user.displayName && user.displayName.charAt(0).toUpperCase()}
                        </Avatar>

                    </div>

                    {/* username and email update */}
                    <div className='w-full space-y-2'>

                        {/* username */}
                        <p className='text-sm text-[#9ca3aa]'>Your Name</p>
                        <form className='flex justify-between items-center space-x-4' onSubmit={updateUsername} >
                            <Input
                                className='p-1 text-xl text-white w-full'
                                value={usernameValue}
                                ref={usernameEdit}
                                style={{ pointerEvents: 'none' }}
                                onChange={(e) => setUsernameValue(e.target.value)}
                                onBlur={() => usernameEdit.current.style.pointerEvents = 'none'}
                            />

                            <Tooltip title="Edit" arrow>
                                <Edit className='cursor-pointer'
                                    onClick={() => {
                                        usernameEdit.current.style.pointerEvents = 'auto';
                                        usernameEdit.current.click();
                                    }} />
                            </Tooltip>

                            <button className='hidden'></button>


                        </form>

                        {/* email */}
                        <p className='text-sm text-[#9ca3aa]'>Your Email</p>
                        <form className='flex justify-between items-center space-x-4' onSubmit={reAuthUser}>
                            <span className='w-full'>
                                <Input
                                    className='p-1 text-xl text-white w-full'
                                    value={emailValue}
                                    ref={emailEdit}
                                    error={emailError !== null}
                                    style={{ pointerEvents: 'none' }}
                                    onChange={(e) => setEmailValue(e.target.value)}
                                    onBlur={() => emailEdit.current.style.pointerEvents = 'none'}
                                />
                                <p className='mx-1 text-sm text-red-600'>{emailError}</p>
                            </span>

                            <Tooltip title="Edit" arrow>
                                <Edit className='cursor-pointer'
                                    onClick={() => {
                                        emailEdit.current.style.pointerEvents = 'auto';
                                        emailEdit.current.click();
                                    }} />
                            </Tooltip>

                            <button className='hidden'></button>

                        </form>

                    </div>


                </div>

            </Backdrop >

        </>
    )
}
