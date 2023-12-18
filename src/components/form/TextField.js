import PropTypes from "prop-types";
import { useContext } from "react";
import { Form, Input } from "semantic-ui-react";

import { ContextForm } from "../../contexts/form";

const TextField = ({ name, label, ...fieldProps }) => {
  const { formState, setFormState, validateAt, formErrors } =
    useContext(ContextForm);

  return (
    <Form.Field
      control={Input}
      name={name}
      label={label}
      value={formState[name]}
      onChange={(e) => setFormState(name, e.target.value)}
      onBlur={() => validateAt(name)}
      error={
        formErrors.hasOwnProperty(name) && {
          content: formErrors[name],
          pointing: "below",
        }
      }
      {...fieldProps}
    />
  );
};

TextField.prototype = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default TextField;
