import React, {useState} from 'react'
import { absoluteFullClasses, Button, Card, CardBody, CardFooter, CardHeader, Divider, Spacer } from '@nextui-org/react'



interface CardData {
    id: number; //number card (1-10)
    title: string; //#id most used 
    word: string; //word that was used 
}

const CardStack: React.FC = () => {
    //fake data btw, this will end up being from a function that gets them from database
    const [cards, setCards] = useState<CardData[]>([
        { id: 1, title: '#1 most used banned word', word: 'That' },
        { id: 2, title: '#2 most used banned word', word: 'This' },
        { id: 3, title: '#3 most used banned word', word: 'Meh' },
        { id: 4, title: '#4 most used banned word', word: 'THAT' },
        // Add more cards as needed
      ]);

      //takes top card off
    const removeTopCard = () => {
        setCards((prevCards) => prevCards.slice(1));
    }

    return (
        <div className = "flex flex-col items-center w-full h-full">
            <div className = "relative w-full h-full mx-auto md:w-3/4 lg:w-1/2">
                {cards.map((card,index) =>(
                    <Card className='justify-center w-full h-full md:h-60 lg:h-60 lg:w-full'
                        key={card.id}
                        style={{position: 'absolute',
                            top: `${index * 5}px`,
                            left: `${index * 5}px`,
                            zIndex: cards.length - index,
                            opacity: index === 0 ? 1 : 0, // Only show the top card
                            transition: 'opacity 0.3s ease' // Smooth transition
                            }}
                        >
                        <CardHeader className='justify-center items-center'>
                            <h2 className='text-2xl md:text-xl'>{card.title}</h2>
                        </CardHeader>
                        <Divider />
                        <CardBody className='justify-center items-center'>
                            <h2 className='text-2xl font-semibold'>{card.word}</h2>
                        </CardBody>
                        <Divider />
                        <CardFooter className='justify-center items-center'>
                            <p className='text-xs'>Word Count: X</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className='flex flex-col relative w-full h-96 mx-auto justify-center'>
            {cards.length > 0 && (
            <Button color="primary" onClick={removeTopCard} className="text-base md:text-lg lg:text-xl px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4"
            >
            next card
            </Button>
      )}
            </div>
        </div>
    );
};

export default CardStack

