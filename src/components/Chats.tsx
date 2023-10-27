import { Avatar, Divider, ListItem } from "@mui/material";
import { getGlobalState } from "../contexts/globalStateContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";


export default function Chats(props: any) {

    const { setChatRoom, user } = getGlobalState();

    async function handleClick() {
        // setChatRoom({ IsChatting: false });
        setChatRoom({ IsChatting: true, name: props.name, photoURL: props.photoURL, userId: props.userId });

        if (props.setFindUserValue) {
            props.setFindUserValue('');
            props.setFindUserArr([]);
        }

        try {
            if (props.userId) {
                const combinedId = user.uid > props.userId ? user.uid + props.userId : props.userId + user.uid
                const res = await getDoc(doc(db, "ChatAppFriendsList", combinedId));
                if (!res.exists()) {
                    await setDoc(doc(db, "ChatAppFriendsList", combinedId), {
                        [user.uid]: props.userId,
                        [props.userId]: user.uid,
                        lastMessage: ''
                    });
                }
            }

        } catch (error) {

        }


    }


    return (
        <>

            <ListItem
                className={`hover:bg-[#202c335b] focus:bg-[#202c33] space-x-3 outline-none cursor-pointer`}
                tabIndex={-1}
                onClick={() => { handleClick() }}
            >

                <Avatar
                    src={props.photoURL}
                    style={{ backgroundColor: props.photoURL }}
                    sx={{ width: 50, height: 50 }}
                    className="pointer-events-none"
                >
                    {props.name.charAt(0).toUpperCase()}
                </Avatar>



                <div className="pointer-events-none">
                    <h1 className='text-lg'>{props.name}</h1>
                    <p className='text-sm text-[#9ca3af]'>{
                        props.lastMessage &&
                        props.lastMessage
                    }
                    </p>
                </div>

            </ListItem >

            <Divider className='bg-[#222e35] border' />
        </>
    )
}
