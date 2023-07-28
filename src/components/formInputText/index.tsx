import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

export const FormInputText = ({ name, control, label, register, pattern, className, inputProps }: {name: string, control: any, label: string, register: any, pattern?: {value: RegExp, message: string}, className?: string, inputProps?: {inputMode: string, pattern: string}}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
      }) => (
        <TextField
          {...register(name, {required: true, pattern})}
          className={"w-full mt-3" + " " + className}
          helperText={error?.type === 'required' ? "Field required" : (error ? error.message : null)}
          size="small"
          error={!!error}
          inputProps={inputProps}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
        />
      )}
    />
  );
};