import { Controller } from "react-hook-form";
import { MenuItem, Select, TextField } from "@mui/material";
import { Prisma } from "@prisma/client";
export const FormInputSelect = ({
  control,
  register,
  items,
  name,
  label,
}: {
  name: string;
  label: string;
  control: any;
  register: any;
  items: Prisma.CampusGetPayload<{
    include: { coordinate: true; address: true };
  }>[];
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          className="w-full"
          select
          label={label}
          {...register(name, {required: true})}
          helperText={
            error?.type === "required"
              ? "Field required"
              : error
              ? error.message
              : null
          }
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          error={!!error}
          onChange={onChange}
        >
          {items.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};
