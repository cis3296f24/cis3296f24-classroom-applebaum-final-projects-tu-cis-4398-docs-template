import React, { useRef } from 'react';
import { Button } from '@nextui-org/react';

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
            <Button color="primary" onClick={ringDevice}>Ring Device</Button>
            <audio ref={audioRef} src="PWASetUp/assests/fart.mp3" preload="auto"></audio>
        </div>
    );
};

export default RingDevice;
