import { useEffect, useRef } from 'react'
import H from '@here/maps-api-for-javascript'

function calculateRoute(platform, map, start, destination) {
    function routeResponseHandler(response) {
        const sections = response.routes[0].sections;
        const lineStrings = [];
        sections.forEach((section) => {
            // convert Flexible Polyline encoded string to geometry
            lineStrings.push(H.geo.LineString.fromFlexiblePolyline(section.polyline));
        });
        const multiLineString = new H.geo.MultiLineString(lineStrings);
        const bounds = multiLineString.getBoundingBox();

        // Create the polyline for the route
        const routePolyline = new H.map.Polyline(multiLineString, {
            style: {
                lineWidth: 5
            }
        });

        const icon1 = new H.map.Icon('/icon1.svg', {
            size: { w: 40, h: 40 }  // Set the size of the icon
        });
        const icon2 = new H.map.Icon('/icon2.svg', {
            size: { w: 40, h: 40 }  // Set the size of the icon
        });

        // Remove all the previous map objects, if any
        map.removeObjects(map.getObjects());
        // Add the polyline to the map
        map.addObject(routePolyline);
        map.addObjects([
            // Add a marker for the user
            new H.map.Marker(start, {
                icon: icon1,
                zIndex: 10 
            }),
            // Add a marker for the selected restaurant
            new H.map.Marker(destination, {
                icon: icon2,
                zIndex: 10 
            })
        ]);
        // Configure the map view to automatically zoom into the bounds 
        // encompassing markers and route polyline:
        map.getViewModel().setLookAtData({ bounds });
    }

    // Get an instance of the H.service.RoutingService8 service
    const router = platform.getRoutingService(null, 8);

    // Define the routing service parameters
    const routingParams = {
        'origin': `${start.lat},${start.lng}`,
        'destination': `${destination.lat},${destination.lng}`,
        'transportMode': 'car',
        'return': 'polyline'
    };
    // Call the routing service with the defined parameters
    router.calculateRoute(routingParams, routeResponseHandler, console.error);
}


const Map = ({apikey, userPosition, venuePosition, setVenueList, setMessages}) => {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null)
    const origin = import.meta.env.VITE_ORIGIN

    useEffect(() => {
        // Function to search for attractions
    const searchForAttractions = async (lat, lng) => {
        if(map.current){
            const service = platform.current.getSearchService();
            service.browse(
              {
                at: `${lat},${lng}`,
                categories: '100-1000-0002,300-3000-0025,200-2000-0000,300-3100-0000', // Categories
                limit: 10, // Limit results
              },
              (result) => {
                console.log(result.items); // Log results to the console
      
                // Add markers to the map for each result
                result.items.forEach((item) => {
                  const marker = new H.map.Marker({
                    lat: item.position.lat,
                    lng: item.position.lng,
                  });
                  map.current.addObject(marker);
                });
                setVenueList(result.items)
                getFinalSchedule(result.items)
              },
              (error) => {
                console.error('Error fetching attractions:', error);
              }
            );
        }
      };

      const getFinalSchedule = async (places) => {
        console.log("places", places)
        const response = await fetch(`${origin}/test`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: `final:-${JSON.stringify(places)}`
        })
        })
        const r = await response.json()
        setMessages(r.res)
      }

        // Check if the map object has already been created
        if (!map.current) {
            // Create a platform object with the API key and useCIT option
            platform.current = new H.service.Platform({
                apikey
            });
            // Obtain the default map types from the platform object:
            const defaultLayers = platform.current.createDefaultLayers({
                pois: true
            });
            // Create a new map instance with the Tile layer, center and zoom level
            // Instantiate (and display) a map:
            const newMap = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map, {
                    zoom: 2,
                    center: userPosition ? userPosition : { lat: 2.8792, lng: 23.656 },
                }
            );

            // Add panning and zooming behavior to the map
            const behavior = new H.mapevents.Behavior(
                new H.mapevents.MapEvents(newMap)
            );

            const ui = H.ui.UI.createDefault(newMap, defaultLayers);
            
            // Set the map object to the reference
            map.current = newMap;
        } 
        
        if(userPosition){
            map.current.setCenter(userPosition)
            map.current.setZoom(10)
            searchForAttractions(userPosition.lat, userPosition.lng)
        }
        if(venuePosition){
            calculateRoute(platform.current, map.current, userPosition, venuePosition)
        }
    }, [venuePosition, apikey, userPosition]);

    // Return a div element to hold the map
    return (
        <div 
            style = {
                {
                    width: "100%",
                    height: "100%"
                }
            }
            ref = {
                mapRef
            }
        />
    )

}

export default Map