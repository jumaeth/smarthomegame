import { useState, useEffect } from 'react';

export const useTypingText = (fullText: string = '', speed: number = 50) => {
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setTypedText('');
    setTypingDone(false);
    let index = 0;

    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed]);

  useEffect(() => {
    if (typingDone) {
      setShowCursor(false);
      return;
    }

    const blink = setInterval(() => {
      setShowCursor((c) => !c);
    }, speed);

    return () => clearInterval(blink);
  }, [typingDone, speed]);

  return { typedText, typingDone, showCursor };
};
