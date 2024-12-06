import React, {useState, useEffect} from 'react'
import {Card, Progress, CardBody, Image, CardFooter} from '@nextui-org/react'
import { MicrophoneIcon } from "@heroicons/react/24/solid";

//make micCard act as button for speech recognition
interface MicCardProps {
    isMicActive: boolean;
    isBadWordDetected: boolean;
    onToggleMic: () => void;
}

const MicCard: React.FC <MicCardProps> = ({isMicActive, isBadWordDetected, onToggleMic}) =>{
    const cardClass = `flex justify-center items-center w-48 h-48 shadow-2xl
        ${isBadWordDetected ? 'bg-gradient-to-br from-black to-red-700' : 'bg-gradient-to-br from-sky-600 to-teal-600'}
        ${isMicActive ? 'animate-pulse' : ''}`;
        return (
            <div className="flex justify-center items-center h-72">
                <Card
                    isFooterBlurred
                    radius="lg"
                    className={cardClass}
                    isPressable
                    onPress={onToggleMic}>
                  <CardBody className='justify-center items-center aspect-square z-0'>
                    <MicrophoneIcon/>
                  </CardBody>
                </Card>
            </div>
    );
};

export default MicCard;