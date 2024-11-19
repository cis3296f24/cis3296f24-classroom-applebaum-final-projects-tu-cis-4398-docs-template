import React, {useState, useEffect} from 'react'
import {Card, Progress, CardBody, Image, CardFooter} from '@nextui-org/react'
import { useRouter } from 'next/router';
//make micCard act as button for speech recognition 
interface MicCardProps {
    isMicActive: boolean;
    isBadWordDetected: boolean;
    onToggleMic: () => void;
}

const MicCard: React.FC <MicCardProps> = ({isMicActive, isBadWordDetected, onToggleMic}) =>{
    const cardClass = `
        flex justify-center items-center w-full h-full shadow-2xl
        ${isBadWordDetected ? 'bg-gradient-to-br from-black to-red-700' : 'bg-gradient-to-br from-sky-600 to-teal-600'}
        ${isMicActive ? 'animate-pulse' : ''}`;
    return (
            <Card 
            isFooterBlurred
            radius='lg'
            className={cardClass}
            isPressable
            onPress={onToggleMic}>
                <CardBody className='justify-center items-center aspect-square'>
                <Image
                        alt='microphone'
                        className='object-cover w-auto h-auto'
                        src="../images/microphone.svg"
                >
                </Image>
                </CardBody>
            </Card>
    );
};

export default MicCard;