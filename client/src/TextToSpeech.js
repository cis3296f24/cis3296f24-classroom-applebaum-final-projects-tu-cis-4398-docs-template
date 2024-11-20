import React, { useState, useEffect } from 'react';

function TextToSpeech({ text }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
  }, [isSpeaking, text]);

  const handleSpeak = () => {
    setIsSpeaking(!isSpeaking);
  };

  return (
    <div>
      <p>{text}</p>
    </div>
  );
}

export default TextToSpeech;