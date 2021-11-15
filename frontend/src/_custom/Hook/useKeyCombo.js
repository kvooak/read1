import { useEffect, useState } from 'react';

export default function useKeyCombo(callback, combo) {
  const [sequel, setSequel] = useState([]);
  const comboString = combo.join('');

  useEffect(() => {
    const sequelString = sequel.join('');
    if (sequelString === comboString) {
      callback();
      setSequel([]);
    }
    return () => {
      if (sequel.length >= 4) setSequel([]);
    };
  }, [sequel]);

  const [pressed, setPressed] = useState();
  const downHandler = (event) => {
    if (event.key === 'Shift') setSequel([]);
    setPressed(event.key);
  };
  const upHandler = (event) => {
    setPressed();
    if (event.key === 'Shift') setSequel([]);
  };

  useEffect(() => {
    if (pressed) {
      if (pressed === combo[0] && !sequel.includes('Shift')) {
        setSequel([pressed]);
      } else {
        setSequel([...sequel, pressed]);
      }
    }
  }, [pressed]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);
}
