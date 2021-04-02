import { useState } from 'react';

export default function useInput(initialState = '', valueKey = 'value') {
  const [value, setValue] = useState(initialState);

  function setValueFromEvent(event) {
    if (event instanceof Event || event.nativeEvent) {
      setValue(event.target[valueKey]);
    } else {
      setValue(event);
    }
  }

  return [value, setValueFromEvent, setValue];
}
