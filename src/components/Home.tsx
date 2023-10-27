import { useEffect } from "react";
import ChatRoom from "./ChatRoom";
import MyAccount from "./MyAccount";
import Profile from "./Profile";
import SideBar from "./SideBar";
import { Alert, Slide, Snackbar } from "@mui/material";
import { getGlobalState } from "../contexts/globalStateContext";
import PromptForPassword from "./PromptForPassword";

export default function Home() {

  const { setSnackbar, snackbar, promptForPassword } = getGlobalState();

  useEffect(() => {
    const home = document.getElementById('Home');
    (home as HTMLDivElement).classList.add('scale-125');
    setTimeout(function () {
      (home as HTMLDivElement).classList.remove('scale-125');
    }, 50);
  }, []);

  const handleSnackbarClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      event
      return;
    }
    setSnackbar(false);
  };

  function SlideTransition(props: any) {
    return <Slide {...props} />;
  }


  return (
    <>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        TransitionComponent={SlideTransition}
        open={snackbar.state}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >

        <Alert severity={snackbar.res} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>



      {promptForPassword.state && <PromptForPassword title={promptForPassword.title} text={promptForPassword.text} from={promptForPassword.from} />}

      <Profile />
      <MyAccount />

      <div className="p-5 max-xl:p-0 h-[100dvh] max-h-full w-full flex items-center justify-center dark:bg-[#19212c] dark:text-white overflow-hidden">

        <div id="Home" className="h-[100dvh] max-h-full max-w-[1600px] w-[1600px] flex rounded duration-200 dark:bg-[#111b21] max-md:scale-100">

          <SideBar />
          <ChatRoom />

        </div>

      </div>

    </>
  )
}
