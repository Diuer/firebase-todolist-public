import PropTypes from "prop-types";
import { useContext } from "react";
import { Form, Select } from "semantic-ui-react";

import { ContextForm } from "../../contexts/form";

const SelectField = ({ name, label, options = [], ...fieldProps }) => {
  const { formState, setFormState, validateAt, formErrors } =
    useContext(ContextForm);

  return (
    <Form.Field
      control={Select}
      name={name}
      label={label}
      options={options}
      value={formState[name]}
      onChange={(_, data) => {
        setFormState(name, data.value);
      }}
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

SelectField.prototype = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default SelectField;
