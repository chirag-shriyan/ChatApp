import { useState, useEffect, useRef } from "react";
import { AppBar, Avatar } from "@mui/material";
import { Send, ArrowBack } from '@mui/icons-material';
import ChatMessages from "./ChatMessages";
import { getGlobalState } from "../contexts/globalStateContext";
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { v4 } from 'uuid'
import { useNavigate } from "react-router-dom";

export default function ChatRoom() {

    const Navigate = useNavigate();
    const { chatRoom, setChatRoom, user } = getGlobalState();
    const [messageValue, setMessageValue] = useState('');
    const [messages, setMessages] = useState([]);
    const messageInput: any = useRef();
    const scrollToBottom: any = useRef();

    async function sendChats(e: any) {
        e.preventDefault();
        messageInput.current.focus();

        if (messageValue.trim().length !== 0) {

            setMessageValue('');

            const combinedId = user.uid > chatRoom.userId ? user.uid + chatRoom.userId : chatRoom.userId + user.uid;
            await updateDoc(doc(db, "ChatAppAllChats", combinedId), {
                messages: arrayUnion({
                    id: v4(),
                    message: messageValue,
                    senderId: user.uid,
                    date: Timestamp.now()
                })
            }).catch(async (e) => {
                if (e.code === 'not-found') {
                    await setDoc(doc(db, "ChatAppAllChats", combinedId), {
                        messages: arrayUnion({
                            id: v4(),
                            message: messageValue,
                            senderId: user.uid,
                            date: Timestamp.now()
                        })
                    })
                }
            })


            await updateDoc(doc(db, "ChatAppFriendsList", combinedId), {
                lastMessage: messageValue,
                lastUpdate: serverTimestamp()
            })
            scrollToBottom.current?.scrollIntoView({ behavior: "smooth" });

        }

    }

    async function getChats() {
        const combinedId = user.uid > chatRoom.userId ? user.uid + chatRoom.userId : chatRoom.userId + user.uid
        onSnapshot(doc(db, "ChatAppAllChats", combinedId), async (res) => {
            const messages = res.data()?.messages;
            setMessages(messages);

        })
    }

    useEffect(() => {
        user && getChats();
        window.onpopstate = () => {
            setChatRoom({ IsChatting: false });
            Navigate('/');
        }

    }, [chatRoom]);

    useEffect(() => {
        scrollToBottom.current?.scrollIntoView()
    }, [messages]);

    return (

        chatRoom.IsChatting ?

            <>
                <div
                    className="w-[70%] h-full flex flex-col bg-inherit border-l-2 border-[#2f3b43] relative max-xl:w-[60%] overflow-clip max-sm:w-screen max-sm:z-10 max-sm:border-0"
                >


                    {/* AppBar */}
                    <AppBar position="static" className="w-full p-3 bg-[#202c33] flex flex-row justify-between">

                        <div className='flex items-center space-x-3'>

                            <ArrowBack
                                className="cursor-pointer hidden max-sm:block"
                                onClick={() => setChatRoom({ IsChatting: false })}
                            />
                            <Avatar
                                src={chatRoom.photoURL && chatRoom.photoURL}
                                style={{ backgroundColor: chatRoom.photoURL && chatRoom.photoURL }}
                            >
                                {chatRoom.name.charAt(0).toUpperCase()}
                            </Avatar>

                            <div>
                                <h1 className='text-lg'>{chatRoom.name}</h1>
                                <p className='text-sm text-[#9ca3af]'></p>
                            </div>

                        </div>

                    </AppBar>

                    {/* Chats  */}

                    {/* <div className="w-full h-full flex flex-col"> */}
                    {/* pb-[148px] */}
                    <div className='w-full h-fit space-y-1 p-5 mt-auto flex flex-col overflow-y-auto styled-scrollbar'>

                        {messages && messages.map((message: any) => {
                            return <ChatMessages key={message.id} sender={message.senderId === user.uid} message={message.message} date={message.date} />
                        })
                        }

                        <div className="pointer-events-none" autoFocus ref={scrollToBottom} />
                    </div>

                    {/* </div> */}



                    {/* Type Messages */}
                    <div className='w-full h-fit max-h-full flex bg-[#202c33]'>

                        <form className="w-full py-3 flex items-center " onSubmit={sendChats}>

                            <textarea

                                className='w-full h-[40px] max-h-fit flex ml-3 p-2 rounded bg-[#2a3942] focus:outline-none resize-none styled-scrollbar-textarea'
                                placeholder='Type a message'
                                value={messageValue}
                                onChange={(e) => setMessageValue(e.target.value)}
                                ref={messageInput}
                                onKeyDown={(e) => {
                                    let keyPressed = e.key;
                                    if (e.shiftKey === false && keyPressed === 'Enter') {
                                        sendChats(e);
                                    }
                                }}

                            />

                            <button className="hidden"></button>
                            <Send className="ml-5 mr-5 cursor-pointer text-[#7c8b95] text-[26px]" onClick={sendChats} />
                        </form>

                    </div>

                </div>

            </>
            :
            <>

                <div
                    className="w-[70%] h-full bg-inherit border-l-2 border-[#2f3b43] relative max-xl:w-[60%] overflow-hidden max-sm:hidden"
                >

                    <div className="w-full h-full flex items-center justify-center">

                        <h1 className="text-5xl relative -top-24 max-sm:text-4xl">Welcome to chatApp</h1>
                    </div>

                </div>


            </>

    )
}
