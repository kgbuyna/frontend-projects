import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";

import Autocomplete from "@mui/material/Autocomplete";
import React from "react";
import { TextField } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState
} from "react";
import { postRequest } from "@/utils/network/handlers";
import { ShoppingCenter } from "@/app/(DashboardLayout)/types/tms/location";
import { ListData } from "@/app/(DashboardLayout)/types/api";

type Props<T> = {
  value: T | null;
  setValue: Dispatch<SetStateAction<T | null>>;
};

type SC = {
  shoppingCenter?: ShoppingCenter;
};

const token = "FpIsZMvA2jzvl3IpXyJUzvPPzuzFs3";
const updateBody = (rpp: number): any => {
  return {
    cnd: {},
    list: {
      rpp: rpp,
      page: 1,
      order: {
        name: -1
      }
    }
  };
};

const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  }
};

const ShoppingCenterInput = <T extends SC>({ value, setValue }: Props<T>) => {
  const [shoppingCenterList, setShoppingCenterList] = useState<
    readonly ShoppingCenter[]
  >([]);

  const handleChangeShoppingCenter = (
    event: SyntheticEvent<Element, Event>,
    value: ShoppingCenter | null
  ) => {
    setValue((prevValue) => {
      if (!prevValue) return prevValue;
      return {
        ...prevValue,
        shoppingCenter: {
          key: value?.pk,
          value: value?.name
        }
      };
    });
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const shoppingCenter = await postRequest<ListData>(
          "/tms/shopping_center/list/",
          updateBody(60),
          config
        );
        setShoppingCenterList(shoppingCenter.ret.data);
      } catch (error) {
        console.error("Error making POST request:", error);
        throw new Error();
      }
    }
    fetchData();
  }, []);
  return (
    <>
      <CustomFormLabel sx={{ mt: 0 }} htmlFor="city-text">
        Худалдааны төв:
      </CustomFormLabel>
      <Autocomplete
        id="city-select"
        options={shoppingCenterList}
        getOptionLabel={(option) => option.name || option.value || ""}
        noOptionsText="Илэрц олдсонгүй."
        clearText="Арилгах"
        onChange={handleChangeShoppingCenter}
        value={value?.shoppingCenter}
        fullWidth
        renderInput={(params) => <TextField {...params} />}
      />
    </>
  );
};

export default ShoppingCenterInput;
