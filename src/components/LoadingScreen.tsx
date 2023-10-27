import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { getGlobalState } from '../contexts/globalStateContext';

export default function LoadingScreen() {

    const { loadingScreenProgress } = getGlobalState();

    return (
        <div className="h-[100dvh] w-full flex justify-center items-center absolute dark:bg-[#19212c] z-10 dark:text-white">

            <div className="relative top-[-100px]  flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Welcome To ChatApp</h1>
                <Box sx={{ width: '350px' }} className="my-10">
                    <LinearProgress variant="determinate" value={loadingScreenProgress} />
                </Box>
            </div>

        </div>
    )
}
