import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { getGlobalState } from '../contexts/globalStateContext'
import { useEffect, useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';


/* How to use
    <PromptForPassword title="promptForPassword.title" text="promptForPassword.text" from="promptForPassword.from"/>

    To use it call setPromptForPassword with the value and import setPromptForPassword from globalStateContext

    It will give a response as promptForPassword.res it will have the props.from as value you have given before
    you can use useEffect to listen for promptForPassword.res
*/

export default function PromptForPassword(props: any) {
    const { promptForPassword, setPromptForPassword, user } = getGlobalState();
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(null);

    const handleClose = () => {
        setPromptForPassword({ state: false });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (inputValue !== '') {
            setError(null);
            const credential = EmailAuthProvider.credential(
                user.email,
                inputValue
            )
            reauthenticateWithCredential(user, credential).then(() => {
                setPromptForPassword({ state: false, res: props.from });

            }).catch((e) => {
                setError(e.code);
                document.getElementById('inputPromptForPassword')?.focus();
            });

        }


    };


    useEffect(() => {
        setTimeout(() => {
            document.getElementById('inputPromptForPassword')?.focus();
        }, 50);
    }, [])


    return (
        <>

            <Dialog open={promptForPassword.state} className='absolute -top-[250px] max-2xl:-top-[200px]'>
                <div className='bg-[#19212c] text-white space-y-1 space-x-2'>

                    <DialogTitle> {props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText className='text-white mb-2'>
                            {props.text}
                        </DialogContentText>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                id='inputPromptForPassword'
                                autoComplete='password'
                                margin="dense"
                                label="Password"
                                helperText={error}
                                error={error !== null}
                                type="password"
                                fullWidth
                                variant="standard"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions className=''>
                        <Button onClick={handleClose} className='hover:bg-[#90caf914] text-[#90caf9]'>Cancel</Button>
                        <Button onClick={handleSubmit} className='hover:bg-[#90caf914] text-[#90caf9]'>Submit</Button>
                    </DialogActions>
                </div>
            </Dialog>


        </>
    )
}
