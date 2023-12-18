import { useState } from "react";

const useInput = (defaultValue = {}) => {
  const [state, setState] = useState(defaultValue);

  return [
    state,
    (e, data) => {
      setState((state) => ({
        ...state,
        [data.name]: data.value,
      }));
    },
    () => setState(defaultValue),
  ];
};

export default useInput;
