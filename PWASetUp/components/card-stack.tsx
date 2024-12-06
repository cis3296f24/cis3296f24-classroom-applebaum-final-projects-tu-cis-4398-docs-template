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
        { id: 1, title: '#1 banned word', word: 'That' },
        { id: 2, title: '#2 banned word', word: 'This' },
        { id: 3, title: '#3 banned word', word: 'Meh' },
        { id: 4, title: '#4 banned word', word: 'THAT' },
        // Add more cards as needed
      ]);

      //takes top card off
    const removeTopCard = () => {
        setCards((prevCards) => prevCards.slice(1));
    }

    return (
        <div className="relative w-full h-32">
          {cards.map((card, index) => (
            index === 0 && ( // Only render the topmost card
              <Card
                key={card.id}
                className='absolute w-full h-32 bg-gradient-to-br from-sky-500 to-sky-600'
                style={{
                  top: `${index * 5}px`,
                  left: `${index * 5}px`,
                  zIndex: cards.length - index,
                }}
              >
                <CardBody className="text-white">
                  <p className="text-sm">{card.title}</p>
                  <h3 className="text-2xl font-bold">{card.word}</h3>
                  <p className="text-sm mb-2">Word Count: X</p>
                  <Button
                    color="primary"
                    onClick={removeTopCard}
                    className="bg-gradient-to-br from-sky-500 to-sky-600 text-white text-base md:text-lg lg:text-xl px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4"
                  >
                    Next
                  </Button>
                </CardBody>
              </Card>
            )
          ))}
        </div>
    );
};

export default CardStack

