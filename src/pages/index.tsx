import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useContext, useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { Prisma } from "@prisma/client";
import InterestContext from "~/contexts/interest";
import BedIcon from "@mui/icons-material/Bed";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { FieldValues, useForm } from "react-hook-form";
import { FormInputText } from "~/components/formInputText";
import { FormInputSelect } from "~/components/formInputSelect";
import FormInputButtonGroup from "~/components/formInputButtonGroup";
import FormInputMoneyText from "~/components/formInputMoneyText";
import FormInputDistanceText from "~/components/formInputDistanceText";
import CreateCampusHouseUnitModal from "~/components/createCampusHouseUnitModal";

interface Props {
  houseUnit: Prisma.HouseUnitGetPayload<{
    include: { coordinate: true; address: true };
  }>;
}

export default function Home() {
  const { email, name, setEmail, setName, signed } =
    useContext(InterestContext);
  const { control, register, handleSubmit, setValue } = useForm();

  // Queries
  const houseUnits = api.housingCloud.getAllHouseUnits.useQuery();
  const campus = api.housingCloud.getAllCampus.useQuery();
  const allInterests = api.housingCloud.getAllUserInterests.useQuery(email);

  // Mutations
  const { mutateAsync: createInterest } =
    api.housingCloud.createInterest.useMutation();
  const { mutateAsync: deleteHouseUnit } =
    api.housingCloud.deleteHouseUnit.useMutation();
  const { mutateAsync: deleteCampus } =
    api.housingCloud.deleteCampus.useMutation();

  // states
  const [open, setOpen] = useState<boolean>(false);
  const [deletedEntities, setDeletedEntities] = useState<string[]>([]);
  const [openFormModal, setOpenFormModal] = useState<{
    open: boolean;
    entity: string;
    method: string;
  }>({ open: false, method: "", entity: "" });
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);
  const [errorDistance, setErrorDistance] = useState<boolean>(false);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<{
    campusId: string;
    distance: number;
    price: number;
    bedrooms: number;
  }>(
    {} as {
      campusId: string;
      distance: number;
      price: number;
      bedrooms: number;
    }
  );
  const [modalData, setModalData] = useState<Props["houseUnit"]>(
    {} as Props["houseUnit"]
  );

  // Functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenFormModal = (entity: string, method: string) =>
    setOpenFormModal({ open: true, entity, method });
  const handleCloseFormModal = () =>
    setOpenFormModal((prev) => ({
      open: false,
      entity: prev.entity,
      method: prev.method,
    }));
  const handlePriceChange = (e: any) =>
    setPrice(Number(e.target.value.replace(/[^0-9.-]+/g, "")));
  const handleDistanceChange = (e: any) =>
    setDistance(Number(e.target.value.replace(/[^0-9.-]+/g, "")));
  const handleIncrement = () => setBedrooms((prev) => prev + 1);
  const handleDecrement = () =>
    setBedrooms((prev) => (prev == 1 ? prev : prev - 1));
  const onSubmit = (data: FieldValues) => {
    setEmail(data.email);
    setName(data.name);
  };
  const onFilterSubmit = (data: FieldValues): void => {
    setError(!price);
    setErrorDistance(!distance);

    if (!price || !distance) {
      return;
    }

    setFilteredData({
      campusId: data.campus,
      distance: distance * 1000,
      price,
      bedrooms,
    });
  };
  const addHouseUnit = () => {
    handleOpenFormModal("houseUnit", "create");
  };
  const addCampus = () => {
    handleOpenFormModal("campus", "create");
  };
  const deleteEntity = (entityId: string, entityType: string) => {
    setDeletedEntities((prev) => [...prev, entityId]);
    switch (entityType) {
      case "houseUnit":
        const filterHouseUnits = houseUnits?.data?.houseUnits.filter((h) => {
          return h.id == entityId;
        })[0];
        if (filterHouseUnits) {
          houseUnits.data?.houseUnits.splice(
            houseUnits.data?.houseUnits.indexOf(filterHouseUnits, 1)
          );
        }
        deleteHouseUnit(entityId);
        break;
      case "campus":
        const filterCampus = campus?.data?.campus.filter((c) => {
          return c.id == entityId;
        })[0];
        if (filterCampus) {
          campus.data?.campus.splice(
            campus.data.campus.indexOf(
              filterCampus,
              1
            )
          );
        }
        deleteCampus(entityId);
        break;

      default:
        break;
    }
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("../components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    setValue("bedrooms", bedrooms);
  }, [bedrooms]);

  useEffect(() => {
    if (price) {
      setValue("price", price);
    }
  }, [price]);

  useEffect(() => {
    if (distance) {
      setValue("distance", distance);
    }
  }, [distance]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60vw",
    height: "90vh",
    bgcolor: "background.paper",
    overflowY: "scroll",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Head>
        <title>Housing Cloud assesment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen items-center justify-center bg-gradient-to-b from-[#fdfbfb] to-[#ebedee] md:flex">
        <div className="h-[10rem] w-screen md:h-screen md:w-[50rem]">
          {signed ? (
            <div className="flex h-full w-full flex-col items-center justify-center px-24">
              <h2 className="mb-3 text-center text-2xl font-bold">
                Found a House Unit near to your campus!
              </h2>
              <form onSubmit={handleSubmit(onFilterSubmit)} className="w-full">
                <FormInputSelect
                  label="Campus"
                  items={campus.data ? campus.data.campus : []}
                  control={control}
                  register={register}
                  name="campus"
                />
                <div className="mb-3 mt-3 flex items-center">
                  <Typography>Number of bedrooms: </Typography>
                  <FormInputButtonGroup
                    bedrooms={bedrooms}
                    handleDecrement={handleDecrement}
                    handleIncrement={handleIncrement}
                  />
                </div>
                <div className="flex items-center">
                  <p className="mr-3 whitespace-nowrap">Max price:</p>
                  <FormInputMoneyText
                    error={error}
                    onChange={handlePriceChange}
                  />
                  <p className="ml-3">/Month</p>
                </div>
                <div className="my-3 flex items-center">
                  <p className="mr-3 whitespace-nowrap">Max distance:</p>
                  <FormInputDistanceText
                    error={errorDistance}
                    onChange={handleDistanceChange}
                  />
                  <p className="ml-3">/Km</p>
                </div>
                <Button className="w-full" variant="outlined" type="submit">
                  Filter
                </Button>
                <Button
                  color="success"
                  className="my-3 w-full"
                  variant="outlined"
                  onClick={() => addHouseUnit()}
                >
                  + House Unit
                </Button>
                <Button
                  color="success"
                  className="w-full"
                  variant="outlined"
                  onClick={() => addCampus()}
                >
                  + Campus
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-24">
              <AccountBoxIcon sx={{ fontSize: 100 }} />
              <Typography className="!mb-0 mt-0">
                <strong>IDENTIFICATION</strong>
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <FormInputText
                  control={control}
                  register={register}
                  pattern={{
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  }}
                  label="E-mail"
                  name="email"
                />
                <FormInputText
                  control={control}
                  register={register}
                  label="Name"
                  name="name"
                />
                <Button type="submit" className="!mt-3 w-full">
                  Submit
                </Button>
              </form>
            </div>
          )}
        </div>
        {signed ? (
          <div className="w-full">
            <Map
              deletedEntities={deletedEntities}
              deleteEntity={deleteEntity}
              houseUnits={houseUnits.data ? houseUnits.data.houseUnits : []}
              campus={campus.data ? campus.data.campus : []}
              handleOpen={handleOpen}
              setModalData={setModalData}
              filterData={filteredData}
            />
          </div>
        ) : (
          <div className="w-full"></div>
        )}
        {modalData !== null ? (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography
                id="modal-modal-title"
                className="capitalize"
                variant="h6"
                component="h2"
              >
                {modalData.name}
              </Typography>
              <Typography
                className="!mb-3 !mt-1"
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                {modalData.description}
              </Typography>
              <img
                alt="house"
                className="!h-[400px] !w-full object-cover"
                width={300}
                height={100}
                src="https://hres.princeton.edu/sites/g/files/toruqf196/files/styles/freeform_750w/public/2019-12/Off-Campus-Housing.jpg?itok=j9Hq4YbQ"
              ></img>
              <Typography className="!mt-2">Details: </Typography>
              <div className="ml-3 mt-0 flex items-center">
                <Typography className="!mr-1">Number of bedrooms: </Typography>
                <BedIcon />
                <Typography className="!mx-1">{modalData.bedrooms}</Typography>
              </div>
              <p className="!mt-0 ml-3 capitalize">
                {modalData.address?.country}, {modalData.address?.city} -{" "}
                {modalData.address?.state}
                <br></br>
                {modalData.address?.street}, {modalData.address?.number},{" "}
                {modalData.address?.zip}
              </p>
              <div className="mt-3 flex">
                <Typography variant="h6" className="!mr-2">
                  US${modalData.price?.toFixed(2)?.toString().replace(".", ",")}
                  /Month
                </Typography>
                <Button
                  className={
                    "text-white" +
                    (!allInterests.data?.interests.includes(modalData.id)
                      ? " !bg-red-600"
                      : " !bg-cyan-400")
                  }
                  onClick={() => {
                    if (!allInterests.data?.interests.includes(modalData.id)) {
                      setOpenSnackbar(true);
                      allInterests.data?.interests.push(modalData.id);
                      createInterest({
                        email,
                        name,
                        houseUnitId: modalData.id,
                      });
                    }
                  }}
                >
                  {allInterests.data?.interests.includes(modalData.id)
                    ? "Interest registered"
                    : "Register interest"}
                </Button>
              </div>
            </Box>
          </Modal>
        ) : null}
        <CreateCampusHouseUnitModal
          handleCloseFormModal={handleCloseFormModal}
          openFormModal={openFormModal.open}
          method={openFormModal.method}
          entity={openFormModal.entity}
        />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Interest registered!
          </Alert>
        </Snackbar>
      </main>
    </>
  );
}
