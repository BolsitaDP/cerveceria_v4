import React from "react";
import { NumericFormat } from "react-number-format";
import TextField from "@mui/material/TextField";

const FormattedInputTypeNumber = ({
  input,
  handleInputChange,
  label,
  name,
  InputProps,
}) => {
  return (
    <NumericFormat
      customInput={TextField}
      label={label}
      name={name}
      sx={{ width: "80%" }}
      value={input}
      // onBlur={handleBlurred}
      thousandSeparator={true}
      decimalScale={0}
      fixedDecimalScale={true}
      onValueChange={(values) => {
        handleInputChange({
          target: {
            name: name,
            value: values.value,
          },
        });
      }}
      InputProps={InputProps}
    />
  );
};

export default FormattedInputTypeNumber;
