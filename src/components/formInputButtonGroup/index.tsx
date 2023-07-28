import { Button, ButtonGroup } from "@mui/material";

const FormInputButtonGroup = ({
  bedrooms,
  handleIncrement,
  handleDecrement,
}: {
  handleDecrement(): void;
  handleIncrement(): void;
  bedrooms: number;
}) => {
  return (
    <ButtonGroup
      className="ml-3"
      size="small"
      aria-label="small outlined button group"
    >
      <Button onClick={() => handleDecrement()}>-</Button>
      <Button disabled className="!text-black">{bedrooms}</Button>
      <Button onClick={() => handleIncrement()}>+</Button>
    </ButtonGroup>
  );
};

export default FormInputButtonGroup;