import React, {useEffect} from "react";
import {XMapbox} from "elements-x/dist/mapbox";
import {useState} from "react";

XMapbox.accessToken =
    'pk.eyJ1IjoiZWFsaWxpIiwiYSI6ImNsZW8zZ2IzbTA1M3gzcHBxYXFzaGQ1a2YifQ.HHntnyI0GB6-oiPZpav57g';

export default function Dashboard() {
    const [cords, setCords] = useState(null)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCords(`${position.coords.longitude}, ${position.coords.latitude}`)
        });
    })

    return (
        <div style={{textAlign: 'center'}}>
            <div>You're logged in from here!</div>
            {cords && (
                <div className={'w-full h-full'}>
                    <x-mapbox zoom={'16'}>
                        <x-marker id="marker" lnglat={cords} center>
                            Looking For Here?
                        </x-marker>
                    </x-mapbox>
                </div>
            )}
        </div>
    );
}
