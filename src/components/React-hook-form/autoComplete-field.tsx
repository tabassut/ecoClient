import type { KeyboardEvent } from "react";
import type { Control, ControllerProps, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  FormControl,
  type SelectProps,
  TextField,
} from "@mui/material";

type RhfSelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  options: { value: string; label: string }[];
  label?: string;
  variant?: "standard" | "outlined" | "filled";
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  freeSolo?: boolean;
} & Omit<SelectProps, "onChange" | "value"> &
  Omit<ControllerProps<T>, "render" | "control">;

export const RhfAutocomplete = <T extends FieldValues>({
  control,
  options,
  label,
  size = "small",
  variant = "outlined",
  disabled = false,
  onKeyDown,
  freeSolo = false,
  ...props
}: RhfSelectFieldProps<T>) => {
  return (
    <Controller
      control={control}
      {...props}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl variant={variant} size={size} fullWidth>
          <Autocomplete
            disablePortal
            slotProps={{
              popper: {
                sx: {
                  zIndex: 2000,
                },
              },
            }}
            freeSolo={freeSolo}
            options={options}
            size={size}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            onChange={(_, newValue) => {
              if (typeof newValue === "string") {
                onChange(newValue);
              } else {
                onChange(newValue?.value || "");
              }
            }}
            onInputChange={
              freeSolo ? (_, newInput) => onChange(newInput) : undefined
            }
            inputValue={freeSolo ? value || "" : undefined}
            value={
              freeSolo
                ? value || ""
                : options.find((opt) => opt.value === value) || null
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={label}
                error={!!error}
                variant="outlined"
                helperText={error ? error.message : null}
                InputProps={{
                  ...params.InputProps,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "15px",
                    bgcolor: "#E6E6E6",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },

                  "& .MuiOutlinedInput-input": {
                    padding: "0 !important",
                    fontSize: "18px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "gray",
                    opacity: 1,
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    pt: 0.1,
                  },
                }}
              />
            )}
            disabled={disabled}
            onKeyDown={onKeyDown}
          />
        </FormControl>
      )}
    />
  );
};

export default RhfAutocomplete;
