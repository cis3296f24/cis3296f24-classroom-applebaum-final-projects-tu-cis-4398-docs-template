import React, { useRef } from 'react';

const RingDevice = () => {
    const audioRef = useRef(null);

    const ringDevice = () => {
        if (audioRef.current) {
            audioRef.current.play();
            alert("playing");
        }
    };

    return (
        <div>
            <button onClick={ringDevice}>Ring Device</button>
            <audio ref={audioRef} src="PWASetUp/assests/Dramatic funny fart sound effect - rusty.mp3" preload="auto"></audio>
            
        </div>
    );
};

export default RingDevice;
