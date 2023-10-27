import { useState, createContext, useContext } from 'react'

const globalStateContext: any = createContext({});

export default function GlobalStateContext({ children }: any) {



    // All the globalStates 
    const [loading, setLoading] = useState(0);
    const [user, setUser]: any = useState('');
    const [loadingScreen, setLoadingScreen]: any = useState(false);
    const [loadingScreenProgress, setLoadingScreenProgress]: any = useState(0);
    const [showProfile, setShowProfile] = useState(false);
    const [showMyAccount, setShowMyAccount] = useState(false);
    const [updatingPage, setUpdatingPage] = useState(false);
    const [promptForPassword, setPromptForPassword] = useState({ state: false });
    const [snackbar, setSnackbar] = useState({ state: false });
    const [chatRoom, setChatRoom] = useState({IsChatting:false});
    const [friendsList, setFriendsList] = useState([]);

    // All the globalStates in a object
    const globalStatesObj = {
        loading,
        setLoading,
        user,
        setUser,
        loadingScreen,
        setLoadingScreen,
        loadingScreenProgress,
        setLoadingScreenProgress,
        showProfile,
        setShowProfile,
        showMyAccount,
        setShowMyAccount,
        updatingPage,
        setUpdatingPage,
        promptForPassword,
        setPromptForPassword,
        snackbar,
        setSnackbar,
        chatRoom,
        setChatRoom,
        friendsList,
        setFriendsList
    }
    //////////////////////////////////////////////



    return (
        <globalStateContext.Provider value={globalStatesObj}>
            {children}
        </globalStateContext.Provider>
    )
}

export function getGlobalState() {
    const globalStates: any = useContext(globalStateContext)
    return globalStates;
}