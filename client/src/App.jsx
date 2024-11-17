import { useState } from "react";
import VenueList from "../components/items/venue-list";
import Map from "../components/maps/Map"
import ChatContainer from "@/components/chat/chat-container";

function App() {
  const [venuePosition, setVenuePosition] = useState(null)
  const [userPosition, setUserPosition] = useState(null)
  const [venueList, setVenueList] = useState([]);
  const [messages, setMessages] = useState([])

  const mapsAPIKey = import.meta.env.HERE_API_KEY

  const handleClick = (location) => {
    setVenuePosition(location)
  }

  return (
    <div className='w-screen h-screen flex'>
      <div className="w-3/5 h-full">
        <div className="w-full h-2/3">
          <Map 
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
        <ChatContainer messages={messages} setMessages={setMessages} setUserPosition={setUserPosition} />
      </div>
    </div>
  )
}

export default App
