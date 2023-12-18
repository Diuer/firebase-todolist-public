import { useState, createContext, useCallback } from "react";
import { Form } from "semantic-ui-react";

export const ContextForm = createContext({});

const FormProvider = ({
  schema,
  defaultValues,
  onSubmit,
  onReset,
  children,
}) => {
  const [state, setState] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const keys = Object.keys(defaultValues);
    let allErrors = {};

    for (let index = 0; index < keys.length; index++) {
      const name = keys[index];

      try {
        await schema.fields[name].validate(state[name], { abortEarly: false });
      } catch (err) {
        if (err.name === "ValidationError") {
          allErrors[name] = err.errors[0];
        }
      }
    }

    const isAllPassed = Object.keys(allErrors).length === 0;

    await setErrors(allErrors);

    if (isAllPassed && typeof onSubmit === "function") {
      onSubmit(state);
    }
  };

  const handleReset = async () => {
    await setState(defaultValues);

    if (typeof onReset === "function") {
      onReset();
    }
  };

  return (
    <ContextForm.Provider
      value={{
        formState: state,
        setFormState: useCallback(
          (name, value) => {
            setState({
              ...state,
              [name]: value,
            });
          },
          [state]
        ),
        validateAt: async (name) => {
          try {
            await schema.fields[name].validate(state[name], {
              abortEarly: false,
            });
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
          } catch (err) {
            if (err.name === "ValidationError") {
              setErrors({ ...errors, [name]: err.errors[0] });
            }
          }
        },
        formErrors: errors,
      }}
    >
      <Form onSubmit={handleSubmit} onReset={handleReset}>
        {children}
      </Form>
    </ContextForm.Provider>
  );
};

export default FormProvider;
