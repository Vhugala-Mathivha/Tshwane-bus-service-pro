import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

const API_KEY = 'AIzaSyA83A7s1BCXBGOXnNAR362CkdeLPKYkGDQ'; 
const BACKEND_URL = 'http://localhost:5013/api/map/stations';

// --- SUB-COMPONENT: DRAWING THE GREEN LINE ---
const Directions = ({ origin, destination }) => {
    const map = useMap();
    const routesLib = useMapsLibrary('routes');
    const [renderer, setRenderer] = useState(null);

    useEffect(() => {
        if (!routesLib || !map) return;
        const dr = new routesLib.DirectionsRenderer({
            map,
            polylineOptions: { strokeColor: '#008000', strokeWeight: 6 },
            suppressMarkers: true
        });
        setRenderer(dr);
    }, [routesLib, map]);

    useEffect(() => {
        if (renderer && origin && destination) {
            const service = new window.google.maps.DirectionsService();
            service.route({
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING
            }, (result, status) => {
                if (status === 'OK') renderer.setDirections(result);
            });
        }
    }, [renderer, origin, destination]);

    return null;
};

// --- SUB-COMPONENT: SEARCH LOGIC ---
// This handles the "Set Location" button logic
const MapContent = ({ stations }) => {
    const [userAddress, setUserAddress] = useState("");
    const [userCoords, setUserCoords] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);
    
    // Load the geocoding library specifically
    const geocodingLib = useMapsLibrary('geocoding');

    const handleSearch = () => {
        if (!geocodingLib) {
            alert("Google Maps is still loading...");
            return;
        }

        const geocoder = new geocodingLib.Geocoder();
        console.log("Searching for:", userAddress);

        geocoder.geocode({ address: userAddress + ", South Africa" }, (results, status) => {
            if (status === "OK") {
                const loc = results[0].geometry.location;
                setUserCoords({ lat: loc.lat(), lng: loc.lng() });
                setSelectedStation(null);
                alert("Location Found! You can now click a station.");
            } else {
                // This alert will tell us EXACTLY what is wrong
                alert("Google Error: " + status + "\nCheck if Geocoding API is enabled in Cloud Console.");
            }
        });
    };

    return (
        <>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Enter suburb (e.g. Hatfield)"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    style={{ flex: 1, padding: '10px' }}
                />
                <button onClick={handleSearch} style={{ padding: '10px 20px', background: '#00AA00', color: 'white', border: 'none' }}>
                    Set My Location
                </button>
            </div>

            <div style={{ height: '500px', width: '100%' }}>
                <Map
                    defaultCenter={{ lat: -25.7479, lng: 28.2293 }}
                    defaultZoom={11}
                    mapId="TSHWANE_MAP"
                >
                    {userCoords && <Marker position={userCoords} label="START" />}

                    {stations.map(s => (
                        <Marker 
                            key={s.id}
                            position={{ lat: s.lat, lng: s.lng }}
                            label={s.name}
                            onClick={() => {
                                if (!userCoords) alert("Enter your location first!");
                                else setSelectedStation({ lat: s.lat, lng: s.lng });
                            }}
                        />
                    ))}

                    {userCoords && selectedStation && (
                        <Directions origin={userCoords} destination={selectedStation} />
                    )}
                </Map>
            </div>
        </>
    );
};

// --- MAIN EXPORT ---
const LandingPage = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        fetch(BACKEND_URL)
            .then(res => res.json())
            .then(data => setStations(data))
            .catch(err => alert("Backend is not responding on port 5013"));
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Tshwane Bus Services</h1>
            <APIProvider apiKey={API_KEY}>
                <MapContent stations={stations} />
            </APIProvider>
        </div>
    );
};

export default LandingPage