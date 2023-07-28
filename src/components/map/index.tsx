import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Bounds, LatLng, LatLngBounds, icon, latLngBounds } from "leaflet";
import { Prisma } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  filterData: {
    campusId: string | undefined;
    distance: number;
    price: number;
    bedrooms: number;
  };
  deletedEntities: string[];
  houseUnits: Prisma.HouseUnitGetPayload<{
    include: { coordinate: true; address: true };
  }>[];
  campus: Prisma.CampusGetPayload<{
    include: { coordinate: true; address: true };
  }>[];
  handleOpen(): void;
  setModalData(
    houseUnitData: Prisma.HouseUnitGetPayload<{
      include: { coordinate: true; address: true };
    }>
  ): void;
  deleteEntity(entityId: string, entityType: string): void;
}

const CurrentPosition = ({
  ...filteredData
}: {
  campusCoordinate: Prisma.CoordinateGetPayload<{}> | undefined;
  distance: number;
  bounds: Bounds | undefined;
}) => {
  const map = useMap();
  let [position, setPosition] = useState<LatLng>(null as unknown as LatLng);

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  useEffect(() => {
    if (filteredData.campusCoordinate) {
      const bounds = new LatLng(
        filteredData.campusCoordinate.x,
        filteredData.campusCoordinate.y
      );
      map.flyTo(bounds, 14);
    }
  }, [filteredData]);

  return position == null ? null : (
    <Marker
      position={position}
      icon={icon({
        iconUrl: "../../blue-marker.png",
        iconSize: [20, 32],
      })}
    >
      <Popup>
        <button>Current position</button>
      </Popup>
    </Marker>
  );
};

const Map = ({ ...props }: Props) => {
  const circleRef: any = useRef();

  let [center, setCenter] = useState<LatLng>(null as unknown as LatLng);
  let [bounds, setBounds] = useState<Bounds | undefined>(undefined);
  let [distances, setDistances] = useState<
    | {
        distance: number;
        houseUnitId: string;
        bedrooms: number;
        price: number;
      }[]
    | undefined
  >(undefined);
  let [houseUnitsCopy, setHouseUnitsCopy] = useState<
    Prisma.HouseUnitGetPayload<{
      include: { coordinate: true; address: true };
    }>[]
  >([]);

  useEffect(() => {
    if (props.houseUnits[0]) {
      setHouseUnitsCopy(() => props.houseUnits);
      setCenter(
        new LatLng(
          props.houseUnits[0].coordinate.x,
          props.houseUnits[0].coordinate.y
        )
      );
    }
  }, [props.houseUnits, props.campus]);

  useEffect(() => {
    if (!!props.filterData?.campusId) {
      const campusFilter: any = props.campus.filter((c) => {
        return props.filterData.campusId == c.id;
      })[0];
      const coordinate = new LatLng(
        campusFilter.coordinate?.x,
        campusFilter.coordinate?.y
      );

      const distances = props.houseUnits.map((houseUnit) => {
        return {
          distance: coordinate.distanceTo(
            new LatLng(houseUnit.coordinate.x, houseUnit.coordinate.y)
          ),
          houseUnitId: houseUnit.id,
          price: houseUnit.price,
          bedrooms: houseUnit.bedrooms,
        };
      });

      setDistances(() => distances);
      setBounds(circleRef.current?._pxBounds);
    }
  }, [props.filterData]);

  useEffect(() => {
    if (!!distances) {
      const filteredDistances = distances
        .filter((d) => {
          return (
            d.distance <= props.filterData.distance &&
            d.bedrooms == props.filterData.bedrooms &&
            d.price <= props.filterData.price
          );
        })
        .map((fd) => {
          return fd.houseUnitId;
        });
      setHouseUnitsCopy(() =>
        props.houseUnits.slice().filter((houseUnit) => {
          return filteredDistances.includes(houseUnit.id);
        })
      );
    } else {
      setHouseUnitsCopy(() => props.houseUnits.slice());
    }
  }, [distances]);

  return center !== null ? (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={6}
      scrollWheelZoom={false}
      className="h-screen w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CurrentPosition
        bounds={bounds}
        distance={500}
        campusCoordinate={
          props.campus?.filter((c) => {
            return props.filterData?.campusId == c.id;
          })[0]?.coordinate
        }
      />
      {props.campus
        ?.filter((c) => {
          return !props.deletedEntities.includes(c.id);
        })
        .map((campus) => (
          <Marker
            position={[campus.coordinate.x, campus.coordinate.y]}
            icon={icon({
              iconUrl: "../../university-marker.png",
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <div className="capitalize">
                <strong className="mb-2 block">{campus.name}</strong>
                <p className="!mt-0">
                  {campus.address.country}, {campus.address.city} -{" "}
                  {campus.address.state}
                  <br></br>
                  {campus.address.street}, {campus.address.number},{" "}
                  {campus.address.zip}
                </p>
              </div>
              <ButtonGroup>
                <Button>
                  <EditIcon />
                </Button>
                <Button
                  onClick={() => props.deleteEntity(campus.id, "campus")}
                  color="error"
                >
                  <DeleteIcon />
                </Button>
              </ButtonGroup>
            </Popup>
            {props.filterData?.distance &&
            props.filterData.campusId == campus.id ? (
              <Circle
                ref={circleRef}
                center={{ lat: campus.coordinate.x, lng: campus.coordinate.y }}
                fillColor="blue"
                radius={props.filterData.distance}
              />
            ) : null}
          </Marker>
        ))}
      {houseUnitsCopy
        .filter((hu) => {
          return !props.deletedEntities.includes(hu.id);
        })
        ?.map((houseUnit) => (
          <Marker
            position={[houseUnit.coordinate.x, houseUnit.coordinate.y]}
            icon={icon({
              iconUrl: "../../marker.png",
              iconSize: [32, 32],
            })}
          >
            <Popup>
              <div
                onClick={() => {
                  props.setModalData(houseUnit);
                  props.handleOpen();
                }}
                className="cursor-pointer capitalize text-sky-600 underline"
              >
                <strong className="mb-2 block">
                  {houseUnit.name}
                  {distances
                    ? " - " +
                      (
                        (distances?.filter((distance) => {
                          return distance.houseUnitId == houseUnit.id;
                        })[0]?.distance || 0) / 1000
                      ).toFixed(2) +
                      "km"
                    : null}
                </strong>
                <p className="!mt-0">
                  {houseUnit.address.country}, {houseUnit.address.city} -{" "}
                  {houseUnit.address.state}
                  <br></br>
                  {houseUnit.address.street}, {houseUnit.address.number},{" "}
                  {houseUnit.address.zip}
                </p>
              </div>
              <ButtonGroup>
                <Button>
                  <EditIcon />
                </Button>
                <Button
                  onClick={() => props.deleteEntity(houseUnit.id, "houseUnit")}
                  color="error"
                >
                  <DeleteIcon />
                </Button>
              </ButtonGroup>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  ) : (
    <>
      <p>Add some HouseUnit and Campus data to start</p>
    </>
  );
};

export default Map;
