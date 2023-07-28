import { Box, Button, Modal, Typography } from "@mui/material";
import { FormInputText } from "../formInputText";
import FormInputButtonGroup from "../formInputButtonGroup";
import { set, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FormInputTextArea } from "../formInputTextArea";
import FormInputMoneyText from "../formInputMoneyText";
import FormInputCoordinateText from "../formInputCoordinateText";
import { api } from "~/utils/api";

const CreateCampusHouseUnitModal = ({
  openFormModal,
  handleCloseFormModal,
  method,
  entity,
}: {
  openFormModal: boolean;
  handleCloseFormModal(): void;
  method: string;
  entity: string;
}) => {
  const { control, register, handleSubmit, setValue, reset } = useForm();

  const { mutateAsync: createHouseUnit } =
    api.housingCloud.createHouseUnit.useMutation();
  const { mutateAsync: createCampus } =
    api.housingCloud.createCampus.useMutation();

  const [bedrooms, setBedrooms] = useState<number>(1);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [errorX, setErrorX] = useState<boolean>(false);
  const [errorY, setErrorY] = useState<boolean>(false);
  const [x, setX] = useState<number | undefined>(undefined);
  const [y, setY] = useState<number | undefined>(undefined);
  const [errorPrice, setErrorPrice] = useState<boolean>(false);

  const handleIncrement = () => setBedrooms((prev) => prev + 1);
  const handleDecrement = () =>
    setBedrooms((prev) => (prev == 1 ? prev : prev - 1));
  const handlePriceChange = (e: any) =>
    setPrice(Number(e.target.value.replace(/[^0-9.-]+/g, "")));
  const handleXChange = (e: any) => setX(Number(e.target.value));
  const handleYChange = (e: any) => setY(Number(e.target.value));
  const submitForm = (data: any) => {
    setErrorPrice(!price);
    setErrorX(!x);
    setErrorY(!y);

    if (entity == "houseUnit" && !price) {
      return;
    }

    if (!x || !y) {
        return;
    }

    data.coordinate = { x: data.x, y: data.y };

    switch (entity) {
      case "houseUnit":
        createHouseUnit(data);
        clearData()
        handleCloseFormModal();
        break;
      case "campus":
        createCampus(data);
        clearData()
        handleCloseFormModal();
        break;

      default:
        break;
    }
  };
  const clearData = () => {
    setBedrooms(1);
    setErrorPrice(false);
    setErrorX(false);
    setErrorY(false);
    setPrice(undefined);
    setX(undefined);
    setY(undefined);
    reset();
  }

  useEffect(() => {
    setValue("price", price);
  }, [price]);

  useEffect(() => {
    setValue("x", x);
  }, [x]);

  useEffect(() => {
    setValue("y", y);
  }, [y]);

  useEffect(() => {
    setValue("bedrooms", bedrooms);
  }, [bedrooms]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30vw",
    height: "90vh",
    bgcolor: "background.paper",
    overflowY: "scroll",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={openFormModal}
      onClose={handleCloseFormModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={handleSubmit(submitForm)}>
          <FormInputText
            control={control}
            label="Name"
            name="name"
            register={register}
          />
          {entity == "houseUnit" ? (
            <>
              <div className="mt-3 flex items-center">
                <FormInputMoneyText
                  onChange={handlePriceChange}
                  error={errorPrice}
                />
                <span className="ml-3">/Month</span>
              </div>
              <div className="mt-3 flex items-center">
                <p>Number of bedrooms: </p>
                <FormInputButtonGroup
                  bedrooms={bedrooms}
                  handleDecrement={handleDecrement}
                  handleIncrement={handleIncrement}
                />
              </div>
              <Typography className="mt-3">Description: </Typography>
              <FormInputTextArea
                control={control}
                label="Description"
                name="description"
                register={register}
              />
            </>
          ) : null}
          <div className="flex">
            <FormInputText
              control={control}
              label="Country"
              name="country"
              register={register}
            />
            <FormInputText
              className="mx-3"
              control={control}
              label="State"
              name="state"
              register={register}
            />
            <FormInputText
              control={control}
              label="City"
              name="city"
              register={register}
            />
          </div>
          <div className="mb-3 flex">
            <FormInputText
              control={control}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              label="Zip"
              name="zip"
              register={register}
            />
            <FormInputText
              className="mx-3"
              control={control}
              label="Number"
              name="number"
              register={register}
            />
            <FormInputText
              control={control}
              label="Street"
              name="street"
              register={register}
            />
          </div>
          Coordinates:
          <div className="flex items-center">
            X:
            <FormInputCoordinateText
              error={errorX}
              onChange={handleXChange}
              className="!mt-0"
            />
            Y:
            <FormInputCoordinateText
              onChange={handleYChange}
              error={errorY}
              className="!mt-0"
            />
          </div>
          <Button type="submit" className="mt-3 w-full" variant="outlined">
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateCampusHouseUnitModal;
