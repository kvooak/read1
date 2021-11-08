import { useState, useEffect } from 'react';

export default function useKeyPress(targetKey) {
  const [pressed, setPressed] = useState(false);
  const downHandler = ({ key }) => {
    if (key === targetKey) {
      setPressed(targetKey);
    }
  };

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return pressed;
}
