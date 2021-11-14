import { useEffect, useState } from 'react';

export default function useKeyCombo(callback, combo) {
  const [sequel, setSequel] = useState([]);
  const comboString = combo.join('-');

  useEffect(() => {
    const sequelString = sequel.join('-');
    if (sequelString === comboString) callback();
  }, [sequel]);

  const [pressed, setPressed] = useState();
  const downHandler = (event) => {
    setPressed(event.key);
  };

  const upHandler = () => {
    setPressed();
  };

  useEffect(() => {
    if (pressed) setSequel([...sequel, pressed]);
    if (!pressed) setSequel([]);
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
