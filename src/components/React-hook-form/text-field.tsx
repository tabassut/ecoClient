import React from "react";
import {
  type Control,
  Controller,
  type ControllerProps,
  type FieldValues,
} from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";

type RhfTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  onCustomChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  trim?: boolean;
} & Omit<TextFieldProps, "onChange" | "value"> &
  Omit<ControllerProps<T>, "render" | "control">;

export const RhfTextField = <T extends FieldValues>({
  control,
  onCustomChange,
  size = "small",
  ...props
}: RhfTextFieldProps<T>) => {
  return (
    <Controller
      control={control}
      {...props}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleBlur = () => {
          let trimmedValue = value;

          if (typeof value === "string") {
            trimmedValue = trimmedValue.trim();
            trimmedValue = trimmedValue.replace(/\s+/g, " ");
          }
          if (trimmedValue !== value) {
            onChange(trimmedValue);
          }
        };

        return (
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onCustomChange || onChange}
            onBlur={handleBlur}
            value={value}
            {...props}
            size={size}
          />
        );
      }}
    />
  );
};

export default RhfTextField;
