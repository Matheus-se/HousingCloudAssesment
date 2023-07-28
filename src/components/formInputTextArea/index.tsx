import { Controller } from "react-hook-form";
import { TextareaAutosize } from "@mui/material";

export const FormInputTextArea = ({ name, control, label, register, pattern }: {name: string, control: any, label: string, register: any, pattern?: {value: RegExp, message: string}}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
      }) => (
        <TextareaAutosize
          {...register(name, {required: true, pattern})}
          className="w-full rounded border border-black border-opacity-25 bg-transparent p-3 hover:border-opacity-100"
          defaultValue={error?.type === 'required' ? "Field required" : (error ? error.message : null)}
          size="small"
          error={!!error}
          onChange={onChange}
          required
          value={value}
          fullWidth
          label={label}
          placeholder="Type in here…"
          variant="outlined"
          color="primary"
        />
      )}
    />
  );
};