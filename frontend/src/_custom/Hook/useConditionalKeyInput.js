import { useEffect, useState } from 'react';

const useConditionalKeyInput = (active) => {
  const [value, setValue] = useState('');
  const notListenToKeys = [
    'Meta',
    'Alt',
    'Control',
    'Shift',
    'CapsLock',
    'ArrowDown',
    'ArrowUp',
    'ArrowLeft',
    'ArrowRight',
  ];
  const downHandler = ({ key }) => {
    setValue((prev) => {
      let newString = prev;
      if (!newString) return `${key}`;
      if (key === 'Backspace') return newString.slice(0, -1);
      if (!notListenToKeys.includes(key)) newString += key;
      return newString;
    });
  };

  useEffect(() => {
    if (!active) setValue('');
  }, [active]);

  useEffect(() => {
    if (active) {
      window.addEventListener('keydown', downHandler);
    }
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  });
  return value;
};

export default useConditionalKeyInput;
