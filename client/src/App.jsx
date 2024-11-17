import { useEffect, useState } from "react";
import VenueList from "../components/items/venue-list";
import Map from "../components/maps/Map"
import ChatContainer from "@/components/chat/chat-container";

function App() {
  const [venuePosition, setVenuePosition] = useState(null)
  const [userPosition, setUserPosition] = useState(null)
  const [venueList, setVenueList] = useState([]);
  const [messages, setMessages] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [chatsOpen, setChatsOpen] = useState(false)

  const mapsAPIKey = import.meta.env.VITE_HERE_API_KEY
  const origin = import.meta.env.VITE_ORIGIN

  const handleClick = (location) => {
    setVenuePosition(location)
  }

  useEffect(() => {
    const updateMessages = async () => {
      try{
        console.log(activeChat)
        if(activeChat){
          const response = await fetch(`${origin}/chat/${activeChat}`)
          const r = await response.json()
          setChatsOpen(false)
          setMessages(r.chat.messages.slice(1))
        }
      }catch(err){
        console.log(err)
      }
    }
    updateMessages()
  }, [activeChat])

  return (
    <div className='w-screen h-screen flex'>
      <div className="w-3/5 h-full">
        <div className="w-full h-2/3">
          <Map 
            activeChat={activeChat}
            apikey={mapsAPIKey}
            userPosition={userPosition}
            venuePosition={venuePosition}
            setVenueList={setVenueList}
            setMessages={setMessages}
          />
        </div>
        <div className="w-full h-1/3">
          <VenueList list={venueList} clickVenue={handleClick}/>
        </div>
      </div>
      <div className="w-2/5 h-full">
        <ChatContainer chatsOpen={chatsOpen} setChatsOpen={setChatsOpen} activeChat={activeChat} setActiveChat={setActiveChat} messages={messages} setMessages={setMessages} setUserPosition={setUserPosition} />
      </div>
    </div>
  )
}

export default App
