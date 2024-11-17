import Venue from "./venue";

export default function VenueList({list, clickVenue}){
    if(list.length === 0){
        return (
          <div 
            className="flex items-center justify-center p-4 overflow-y-hidden overflow-x-scroll w-full h-full gap-3 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background"
          >
            <h2>Your travel destinations will be here.</h2>
          </div>
        )
      }
    return (
        <div  className="flex p-4 overflow-y-hidden overflow-x-scroll w-full h-full gap-3 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
            {list.map((entry, index) => (
                <Venue key={index} data={entry} clickVenue={clickVenue}/>
            ))}
        </div>
    )
}