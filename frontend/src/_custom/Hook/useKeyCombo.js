import { useEffect, useState } from 'react';
import useKeyPress from './useKeyPress';

export default function useKeyCombo(callBack, ...combo) {
  const firstKeyPressed = useKeyPress(combo[0]);
  const secondKeyPressed = useKeyPress(combo[1]);
  const [sequel, setSequel] = useState([]);

  useEffect(() => {
    setSequel([]);
    if (firstKeyPressed) setSequel([...sequel, firstKeyPressed]);
    if (secondKeyPressed) setSequel([...sequel, secondKeyPressed]);
  }, [firstKeyPressed, secondKeyPressed]);

  useEffect(() => {
    if (sequel.length === combo.length) {
      if (sequel.every((value, index) => value === combo[index])) callBack();
      setSequel([]);
    }
  }, [sequel]);
}
