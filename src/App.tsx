import './firebase.js'
import { onAuthStateChanged } from 'firebase/auth';

import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getGlobalState } from "./contexts/globalStateContext.js";

import Login from "./components/Login.js";
import SignUp from './components/SignUp';
import Home from './components/Home.js';

import LoadingBar from "react-top-loading-bar";
import LoadingScreen from './components/LoadingScreen.js';
import { Backdrop } from '@mui/material';
import { auth, db } from './firebase.js';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';



export default function App() {

  const {
    loading,
    setLoading,
    loadingScreen,
    setLoadingScreen,
    setLoadingScreenProgress,
    setUser,
    updatingPage,
    setFriendsList,
    user
  } = getGlobalState();

  const Navigate = useNavigate();

  // Getting FriendsList from the database
  async function getFriendsList() {

    const q = query(collection(db, "ChatAppFriendsList"), where(user.uid, "!=", null));
    onSnapshot(q, (lists) => {

      const friends: any = [];
      lists.forEach(async (e) => {
        const id = e.data()[user.uid];
        let friend: any = (await getDoc(doc(db, "ChatAppUsers", id))).data();
        friend.lastMessage = e.data().lastMessage;
        friend.lastUpdate = e.data().lastUpdate ? e.data().lastUpdate : 0;
        friends.push(friend);
        setFriendsList([...friends]);
      });
    });

  }

  useEffect(() => {
    setLoadingScreen(true);
    setLoadingScreenProgress(0);
    onAuthStateChanged(auth, (user) => {
      setLoadingScreen(true);
      setLoadingScreenProgress(0);
      if (user) {
        setUser(user);
        setTimeout(() => {
          setLoadingScreenProgress(20);
        }, 100);
        setTimeout(() => {
          setLoadingScreenProgress(100);
        }, 1000);
        setTimeout(() => {
          setLoadingScreen(false);
        }, 2000);
        Navigate('/');
      } else {
        setTimeout(() => {
          setLoadingScreenProgress(20);
        }, 100);
        setTimeout(() => {
          setLoadingScreenProgress(100);
        }, 1000);
        setTimeout(() => {
          setLoadingScreen(false);
        }, 2000);
        Navigate('/login');
      }
    });

  }, []);

  useEffect(() => {
    user && getFriendsList();
  }, [user])


  return (
    <>

      {updatingPage && <Backdrop
        open={updatingPage}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 100 }}
      ></Backdrop>}

      {loadingScreen ? <LoadingScreen /> :
        <>
          <LoadingBar
            color='#2563eb'
            progress={loading}
            onLoaderFinished={() => setLoading(0)}
          />

          <Routes>

            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />


          </Routes>
        </>
      }

    </>
  )
}

