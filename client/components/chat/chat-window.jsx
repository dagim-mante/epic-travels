import { useEffect, useState } from "react"
import CountrySelect from "./country-select"


import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function ChatWindow({countryValue, setCountryValue, activeChat, setActiveChat, setUserPosition, messages, setMessages, chatWindowRef}){
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState({
    from: new Date(2024, 10, 17),
    to: addDays(new Date(2024, 10, 17), 20),
  })
  const origin = import.meta.env.VITE_ORIGIN

  useEffect(() => {
    const fillCountry = async () => {
      if(countryValue.length > 0){
        try{
          const response = await fetch(`${origin}/chat/${activeChat}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: `text:-${countryValue}`
            })
          })
          const r = await response.json()
          setMessages(r.chat.messages.slice(1))
        }catch(error){
          console.log(error)
        }
      }
    }

    fillCountry()
  }, [countryValue])

  const handleDateSubmit = async () => {
    try{
      const response = await fetch(`${origin}/chat/${activeChat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `text:-${date.from}-${date.to}`
        })
      })
      const r = await response.json()
      setMessages(r.chat.messages.slice(1))
    }catch(error){
      console.log(error)
    }
  }


  const getDataOnLocation = async (loc) => {
    const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${loc}&limit=1&apiKey=${import.meta.env.VITE_HERE_API_KEY}`)
    const data = await response.json()
    if(response.status === 200){
      if(data.items.length > 0){
        const finalLocation = data.items[0].position
        console.log('here', finalLocation)
        setUserPosition(finalLocation)
      }
    }
  }
  
   // Function to scroll to the bottom
   const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if(messages.length === 0){
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
          console.log(chat)
          setActiveChat(chat._id)
          addIdToLocalStorage(chat._id)
          setMessages(chat.messages.slice(1))
        }
      }catch(error){
        console.log(error)
      }
    }
    return (
      <div 
        className="flex-1 flex-col flex items-center justify-center overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background"
      >
        {!activeChat ? (
          <>
            <h2>Start chatting with me i can help you plan a trip.</h2>
            <Button onClick={startChat}>Start chat</Button>
          </>
        ) : null }
      </div>
    )
  }

    return (
      <div 
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background"
      >
      {messages.map(message => (
        <div key={message.id}>
          {message.content.trim().split(':-')[0] === 'text' ? (
            <div
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {message.content.split(':-')[1]}
              </div>
            </div>
          ) : (
            <div key={message.id} className="p-4 min-h-36 max-w-[80%] mx-auto flex flex-col items-center rounded-lg shadow-md bg-gradient-to-br from-slate-200 to-slate-400">
                {message.content.trim().split(':-')[0]  === 'select' ? (
                  <CountrySelect 
                    open={open}
                    setOpen={setOpen}
                    value={countryValue}
                    setValue={setCountryValue}
                    />
                  ) : null
                }
                {message.content.trim().split(':-')[0] === 'calendar' ? (
                  <div className="flex flex-col max-w-[90%] items-center justify-center mx-auto gap-2">
                      <p className="text-sm font-semibold self-start mb-2">Select your arrival and exit dates: </p>
                      <div className={cn("grid gap-2")}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {date?.from ? (
                                date.to ? (
                                  <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(date.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={date?.from}
                              selected={date}
                              onSelect={setDate}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        <Button onClick={handleDateSubmit}>Done</Button>
                      </div>
                  </div>
                  ) : null
                }
                {message.content.trim().split(':-')[0] === 'action' ? (
                  <div>
                    <p className="text-sm font-semibold self-start mb-2">So, you want a plan to visit {message.content.trim().split(':-')[1]}</p>
                    <Button onClick={() => getDataOnLocation(message.content.trim().split(':-')[1])} >
                      Yes
                    </Button>
                  </div>
                ) : null }
                {message.content.trim().split(':-')[0] === 'final' ? (
                  <div className="flex flex-col justify-center items-center">
                    <p className="mb-2 text-xl">🔥</p>
                    <p className="text-md font-semibold self-start mb-2">Generating an epic plan, please wait......</p>
                  </div>
                ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
    )
}