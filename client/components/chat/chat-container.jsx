import { useRef, useState } from "react";
import ChatWindow from "./chat-window";
import ChatInput from "./chat-input";
import { Folder, SquarePen } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { ScrollArea } from "@/components/ui/scroll-area"

  

export default function ChatContainer({chatsOpen, setChatsOpen, activeChat, setActiveChat, messages, setMessages, setUserPosition}){
    const chatWindowRef = useRef(null)
    const inputRef = useRef(null)
    const [countryValue, setCountryValue] = useState("")
    
    const origin = import.meta.env.VITE_ORIGIN

    function addIdToLocalStorage(newId) {
        const existingIds = JSON.parse(localStorage.getItem('chats')) || [];
      
        if (!existingIds.includes(newId)) {
          existingIds.push(newId);
          localStorage.setItem('chats', JSON.stringify(existingIds));
          console.log(`ID ${newId} added to localStorage.`);
        }
      
        return existingIds;
      }

    const startChat = async () => {
        try{
          const response = await fetch(`${origin}/new-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          const {chat} = await response.json()
          if(response.status === 200){
            setCountryValue("")
            setActiveChat(chat._id) 
            addIdToLocalStorage(chat._id) 
            setMessages(chat.messages.slice(1))
          }
        }catch(error){
          console.log(error)
        }
      }

      const getChats = () => {
        const existingIds = JSON.parse(localStorage.getItem('chats')) || []
        return existingIds
      }

    return (
        <div className="flex flex-col h-full w-full bg-background shadow-xl rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between bg-primary text-primary-foreground p-4">
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <SquarePen onClick={startChat} className="w-5 h-5 text-white cursor-pointer"/>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>New Chat</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
                <h1 className="text-2xl font-bold text-center">Epic Travels</h1>
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Folder onClick={() => setChatsOpen(true)} className="w-5 h-5 text-white cursor-pointer" />
                        <Dialog open={chatsOpen} onOpenChange={setChatsOpen}>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Your Chats</DialogTitle>
                            <DialogDescription>
                                Previous chats you had witt this bot.
                            </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="flex items-center justify-center backdrop:h-[200px] w-full rounded-md border p-4">
                                {getChats().length > 0 ? (
                                    <>
                                        {getChats().map((chat, index) => (
                                            <p onClick={() => setActiveChat(chat)} className="mb-1 cursor-pointer hover:text-blue-500" key={index}>Chat {index+1}</p>
                                        ))}
                                    </>
                                ) : (
                                    <h2>No Chat history</h2>
                                )}
                            </ScrollArea>
                        </DialogContent>
                        </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Chats</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </div>

            {/* Chat Window with custom scrollbar */}
            <ChatWindow countryValue={countryValue} setCountryValue={setCountryValue} activeChat={activeChat} setActiveChat={setActiveChat} setUserPosition={setUserPosition} messages={messages} setMessages={setMessages} chatWindowRef={chatWindowRef}/>

            {/* Chat Input */}
            {activeChat ? (
                <ChatInput activeChat={activeChat} inputRef={inputRef} setMessages={setMessages} />
            ) : null }
        </div>
    )
} 