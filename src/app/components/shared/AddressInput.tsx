import { FormHelperText, Grid } from "@mui/material";
import { ChangeEvent, SetStateAction, SyntheticEvent } from "react";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import Autocomplete from "@mui/material/Autocomplete";

import { TextField } from "@mui/material";
import {
  Address,
  City,
  District,
  Quarter
} from "@/app/(DashboardLayout)/types/tms/location";
import { gql, useQuery } from "@apollo/client";
import { FormikErrors } from "formik";

type Props<T> = {
  value: T | null;
  setValue: (
    values: SetStateAction<T>
  ) => Promise<void> | Promise<FormikErrors<T>>;
  hasAddressForm: boolean;
  hasQuarter: boolean;
  error: {
    city?: boolean;
    district?: boolean;
    quarter?: boolean;
    address?: boolean;
  };
};
const GET_LOCATIONS = gql`
  query Locations {
    cities {
      edges {
        cursor
        node {
          name
          uuid
        }
      }
    }
    districts {
      edges {
        node {
          city {
            uuid
          }
          uuid
          name
          code
        }
      }
    }
    quarters {
      edges {
        cursor
        node {
          uuid
          name
          district {
            uuid
          }
        }
      }
    }
  }
`;

const AddressInput = <T extends Address>({
  value,
  setValue,
  hasAddressForm = false,
  hasQuarter = true,
  error
}: Props<T>) => {
  const { data } = useQuery(GET_LOCATIONS);

  const cityList: City[] = data?.cities.edges.map(
    (city: { node: City }) => city.node
  );
  const districtList: District[] = data?.districts.edges.map(
    (district: { node: District }) => district.node
  );
  const quarterList: Quarter[] = data?.quarters.edges.map(
    (quarter: { node: Quarter }) => quarter.node
  );

  const handleChangeCity = (
    event: SyntheticEvent<Element, Event>,
    selectedCity: City | null
  ) => {
    if (selectedCity?.uuid === value?.city?.uuid) return;
    setValue((prevState) => ({
      ...prevState,
      city: { uuid: selectedCity?.uuid, name: selectedCity?.name },
      district: null,
      quarter: null
    }));
  };

  const handleChangeDistrict = (
    event: SyntheticEvent<Element, Event>,
    selectedDistrict: District | null
  ) => {
    if (selectedDistrict?.uuid === value?.district?.uuid) return;
    setValue((prevState) => ({
      ...prevState,
      district: {
        uuid: selectedDistrict?.uuid,
        name: selectedDistrict?.name
      },
      quarter: null
    }));
  };

  const handleChangeQuarter = (
    event: SyntheticEvent<Element, Event>,
    selectedQuarter: Quarter | null
  ) => {
    if (selectedQuarter?.pk === value?.quarter?.key) return;
    setValue((prevState) => ({
      ...prevState,
      quarter: {
        uuid: selectedQuarter?.uuid,
        name: selectedQuarter?.name
      }
    }));
  };
  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((prevState) => ({
      ...prevState,
      address: event.target.value
    }));
  };

  return (
    <Grid container rowSpacing={1} columnSpacing={2}>
      <Grid item lg={6} md={12} xs={12}>
        <CustomFormLabel sx={{ mt: 0 }} htmlFor="city-select">
          Аймаг, нийслэл:
        </CustomFormLabel>
        <Autocomplete
          id="city-select"
          options={cityList || []}
          getOptionLabel={(option) => option.name || ""}
          noOptionsText="Илэрц олдсонгүй."
          clearText="Арилгах"
          onChange={handleChangeCity}
          value={value?.city}
          fullWidth
          renderInput={(params) => <TextField {...params} error={error.city} />}
        />

        {error?.city ? (
          <FormHelperText sx={{ color: "error.main" }}>
            Энэ талбарыг бөглөх шаардлагатай.
          </FormHelperText>
        ) : (
          <FormHelperText></FormHelperText>
        )}
      </Grid>
      <Grid item lg={6} md={12} xs={12}>
        <CustomFormLabel sx={{ mt: 0 }} htmlFor="district-select">
          Сум, дүүрэг
        </CustomFormLabel>
        <Autocomplete
          id="district-select"
          options={
            districtList?.filter(
              (district) => district?.city?.uuid === value?.city?.uuid
            ) || []
          }
          // sx
          getOptionLabel={(option) => option.name || ""}
          noOptionsText="Илэрц олдсонгүй."
          onChange={handleChangeDistrict}
          clearText="Арилгах"
          fullWidth
          value={value?.district}
          renderInput={(params) => {
            const updatedParams = {
              ...params,
              value: value?.district?.name || ""
            };
            return <TextField {...updatedParams} error={error.district} />;
          }}
        />
        {error?.district ? (
          <FormHelperText sx={{ color: "error.main" }}>
            Энэ талбарыг бөглөх шаардлагатай.
          </FormHelperText>
        ) : (
          <FormHelperText></FormHelperText>
        )}
      </Grid>
      {hasQuarter && (
        <Grid item lg={6} md={12} xs={12}>
          <CustomFormLabel sx={{ mt: 0 }} htmlFor="quarter-select">
            Баг, хороо
          </CustomFormLabel>
          <Autocomplete
            id="quarter-select"
            options={
              quarterList?.filter(
                (quarter) => quarter?.district?.uuid === value?.district?.uuid
              ) || []
            }
            noOptionsText="Илэрц олдсонгүй."
            onChange={handleChangeQuarter}
            clearText="Арилгах"
            getOptionLabel={(option) => option.name || ""}
            value={value?.quarter}
            fullWidth
            renderInput={(params) => {
              const updatedParams = {
                ...params,
                value: value?.quarter?.name || ""
              };
              return <TextField {...updatedParams} error={error.quarter} />;
            }}
          />

          {error?.quarter ? (
            <FormHelperText sx={{ color: "error.main" }}>
              Энэ талбарыг бөглөх шаардлагатай.
            </FormHelperText>
          ) : (
            <FormHelperText></FormHelperText>
          )}
        </Grid>
      )}
      {hasAddressForm && (
        <Grid item lg={12} md={12} xs={12}>
          <CustomFormLabel sx={{ mt: 0 }} htmlFor="address">
            Хаяг
          </CustomFormLabel>
          <TextField
            id="address"
            fullWidth
            variant="outlined"
            multiline
            onChange={handleChangeAddress}
            value={value?.address || ""}
            error={error.address}
          />

          {error?.address ? (
            <FormHelperText sx={{ color: "error.main" }}>
              Энэ талбарыг бөглөх шаардлагатай.
            </FormHelperText>
          ) : (
            <FormHelperText></FormHelperText>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default AddressInput;
