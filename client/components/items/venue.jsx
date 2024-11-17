import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Venue({data, clickVenue}) {
    
    const handleClick = () => {
      clickVenue(data.position);
    };
  
    return (
      <div className="rounded-sm min-w-[300px] border-2 p-2">
        <h2 className="font-semibold">{data.title}</h2>
        <p className="text-xs">Location: {data.address.label}</p>
        <p className="h-12 overflow-hidden my-1 leading-[-5px] text-xs text-muted-foreground overflow-ellipsis">
          {`${data.title} is located in ${data.address.city} it has beed chosen for you as a potential place to check out whern you are in ${data.address.city}.It is a ${data.categories[0].name} location. Click the button below to find out more.`}
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={handleClick} className='bg-secondary-foreground text-white'>Directions</Button>
          <Dialog className="relative">
            <DialogTrigger asChild>
              <Button className='bg-blue-700 text-white'>Details</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{data.title}</DialogTitle>
                <DialogDescription>
                  {data.address.label}
                </DialogDescription>
              </DialogHeader>
              <div className="relative w-full h-full">
                <p> {`${data.title} is located in ${data.address.city} it has beed chosen for you as a potential place to check out whern you are in ${data.address.city}.It is a ${data.categories[0].name} location.`}</p>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${data.position.lng-3}%2C${data.position.lat-3}%2C${data.position.lng+3}%2C${data.position.lat+3}&layer=mapnik&marker=${data.position.lat}%2C${data.position.lng}&zoom=10`}
                  width={450}
                  height={400}
                  style={{border:0}}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }