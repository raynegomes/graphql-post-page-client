import { useState } from 'react';

export const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const handleChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = callback => event => {
    event.preventDefault();
    callback();
  };

  return {
    handleChange,
    handleSubmit,
    values,
  };
};
