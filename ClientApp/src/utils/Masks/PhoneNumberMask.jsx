import React, { forwardRef } from "react";
import InputMask from "react-input-mask";
import { TextField, InputAdornment } from "@mui/material";
import { Phone } from "@mui/icons-material";

export const PhoneNumberInput = forwardRef((props, ref) => {
  return (
    <InputMask
      mask="+7 (999) 999-99-99"
      value={props.value}
      onChange={props.onChange}
    >
      {(inputProps) => (
        <TextField
          {...inputProps}
          inputRef={ref}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
            sx: { color: "#638889" },
          }}
          placeholder="Телефон"
        />
      )}
    </InputMask>
  );
});

export default PhoneNumberInput;
