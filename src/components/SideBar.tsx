import { useEffect, useState } from 'react'

import { AppBar, Avatar, IconButton, Tooltip, Box, Menu, MenuItem, ListItemIcon, List } from '@mui/material';
import { Logout, Settings, AccountCircle } from '@mui/icons-material';

import { signOut } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";

import Chats from './Chats';
import { getGlobalState } from "../contexts/globalStateContext";
import { auth, db } from '../firebase';

export default function SideBar() {

    const { user, setUser, setShowProfile, setShowMyAccount, setChatRoom, friendsList } = getGlobalState();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [findUserValue, setFindUserValue] = useState('');
    const [findUserArr, setFindUserArr]: any = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleOpenUserMenu = (event: any) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);

    };

    const showProfile = () => {
        setShowProfile(true);
        setTimeout(function () {
            const Profile = document.getElementById('Profile');
            (Profile as HTMLDivElement).classList.remove('-translate-y-52');
        }, 50);
    }

    const showMyAccount = () => {
        setShowMyAccount(true);
        setTimeout(function () {
            const MyAccount = document.getElementById('MyAccount');
            (MyAccount as HTMLDivElement).classList.remove('-translate-y-52');
        }, 50);
    }

    function LogOut() {
        setUser('')
        signOut(auth).then(() => {
            setChatRoom({ IsChatting: false });
        });
    }

    async function findUser(e: any) {

        e && e.preventDefault();
        if (findUserValue !== '') {
            setIsSearching(true);

            const q = query(collection(db, "ChatAppUsers"));
            const querySnapshot = await getDocs(q);
            const users: any = [];
            querySnapshot.forEach((doc) => {
                if (doc.id !== user.uid && new RegExp(findUserValue, 'i').test(doc.data().displayName)) {
                    users.push(doc.data());
                }
            });

            setFindUserArr(users);
        }

    }

    // Search debounce for finding users
    useEffect(() => {
        if (findUserValue === '') {
            setIsSearching(false);
        }

        const timer = setTimeout(() => {
            if (findUserValue && findUserValue !== '') {
                findUser(undefined);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [findUserValue]);

    return (
        <>

            <div
                className="w-[30%] h-full bg-inherit relative overflow-hidden max-xl:w-[40%] max-sm:w-screen max-sm:absolute"
            >

                {/* AppBar */}
                <AppBar position="static" className="p-3 bg-[#202c33] flex flex-row justify-between">

                    <h1 className="font-extrabold text-xl flex items-center"> ChatApp</h1>

                    {/* Menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                                <Avatar
                                    className="hover:cursor-pointer"
                                    style={{ backgroundColor: user.photoURL && user.photoURL }}
                                    src={user.photoURL && user.photoURL}
                                >
                                    {user.displayName && user.displayName.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}

                        >

                            <MenuItem onClick={() => { showProfile(); handleCloseUserMenu() }}>
                                <ListItemIcon>
                                    <AccountCircle fontSize="small" className="text-white" />
                                </ListItemIcon>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => { showMyAccount(); handleCloseUserMenu() }}>
                                <ListItemIcon>
                                    <Settings fontSize="small" className="text-white" />
                                </ListItemIcon>
                                My account
                            </MenuItem>
                            <MenuItem onClick={() => { LogOut(); handleCloseUserMenu(); }}>
                                <ListItemIcon>
                                    <Logout fontSize="small" className="text-white" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>

                        </Menu>
                    </Box>

                </AppBar>

                {/* Find Users */}

                <div className='w-full flex flex-col items-center'>
                    <form className='w-full flex flex-col items-center' onSubmit={(e) => findUser(e)}>
                        <input
                            type="text"
                            className='w-[95%] my-3 p-2 rounded bg-[#202c33] focus:outline-none'
                            placeholder='Find Users (By username)'
                            value={findUserValue}
                            onChange={(e) => { setFindUserValue(e.target.value); e.target.value === '' && setFindUserArr([]); }}
                        />
                        <button className='hidden'></button>
                    </form>
                    {findUserArr.map((users: any) => {
                        return <Chats
                            key={users.userId}
                            name={users.displayName}
                            photoURL={users.photoURL}
                            setFindUserValue={setFindUserValue}
                            setFindUserArr={setFindUserArr}
                            userId={users.userId}
                        />
                    })
                    }
                    <hr className='w-full border-[#222e35] border-2' />
                </div>

                {/* Chats */}



                {!isSearching && <List
                    className='p-0 pb-[140px] w-full h-full relative overflow-y-auto styled-scrollbar'
                >

                    {friendsList.sort((a: any, b: any) => b.lastUpdate - a.lastUpdate).map((users: any) => {
                        return <Chats
                            key={users.userId}
                            name={users.displayName}
                            photoURL={users.photoURL}
                            lastMessage={users.lastMessage}
                            userId={users.userId}
                        />
                    })
                    }


                </List>
                }





            </div >

        </>
    )
}
