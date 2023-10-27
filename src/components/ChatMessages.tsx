
export default function ChatMessages(props: any) {
    return (
        <>
            {props.sender ?
                // Sending Side
                <div className="w-full flex justify-end"> 
                    <div className="max-w-[55%] h-fit bg-gray-300 text-[#111b21] p-[6px] rounded-md">
                        <p className="text-sm">{props.message + ' '}

                            <small className="text-[10px] text-gray-500 relative -bottom-1">
                                {props.date && new Date(props.date.toDate()).toLocaleTimeString()}
                            </small>
                        </p>
                    </div>
                </div>

                :
                // Receiving Side 
                <div className="w-full flex justify-start">
                    <div className="max-w-[55%] h-fit bg-gray-300 text-[#111b21] p-[6px] rounded-md">
                        <p className="text-sm">{props.message + ' '}

                            <small className="text-[10px] text-gray-500 relative -bottom-1">
                                {props.date && new Date(props.date.toDate()).toLocaleTimeString()}
                            </small>
                        </p>
                    </div>
                </div>

            }

        </>
    )
}
