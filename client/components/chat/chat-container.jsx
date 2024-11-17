import { useRef, useState } from "react";
import ChatWindow from "./chat-window";
import ChatInput from "./chat-input";

export default function ChatContainer({messages, setMessages, setUserPosition}){
    const chatWindowRef = useRef(null)
    const inputRef = useRef(null)

    return (
        <div className="flex flex-col h-full w-full bg-background shadow-xl rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-primary text-primary-foreground p-4">
                <h1 className="text-2xl font-bold text-center">Epic Travels</h1>
            </div>

            {/* Chat Window with custom scrollbar */}
            <ChatWindow setUserPosition={setUserPosition} messages={messages} setMessages={setMessages} chatWindowRef={chatWindowRef}/>

            {/* Chat Input */}
            <ChatInput inputRef={inputRef} setMessages={setMessages} />
        </div>
    )
} 