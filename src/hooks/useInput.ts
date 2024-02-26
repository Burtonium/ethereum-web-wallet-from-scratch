import { useState } from 'react';

type UseInputReturn = [
  string,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
  () => void
];

const useInput = (initialValue: string): UseInputReturn => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return [value, handleChange, reset];
};

export default useInput;