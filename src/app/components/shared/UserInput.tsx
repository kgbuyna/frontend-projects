import React from "react";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState
} from "react";
import { postRequest } from "@/utils/network/handlers";
import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";
import Autocomplete from "@mui/material/Autocomplete";

import { TextField } from "@mui/material";
import { ListData } from "@/app/(DashboardLayout)/types/api";
import { User } from "@/app/(DashboardLayout)/types/auth/auth";

type Props<T> = {
  value: T | null;
  setValue: Dispatch<SetStateAction<T | null>>;
};
const updateBody = (rpp: number): any => {
  return {
    cnd: {},
    list: {
      rpp: rpp,
      page: 1,
      order: {
        // name: 1
      }
    }
  };
};

type U = {
  user?: User | undefined;
};

const token = "FpIsZMvA2jzvl3IpXyJUzvPPzuzFs3";
const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  }
};

const UserInput = <T extends U>({ value, setValue }: Props<T>) => {
  const [userList, setUserList] = useState<readonly User[]>([]);

  useEffect(() => {
    postRequest<ListData>("/auth/user/list/", updateBody(100), config).then(
      (res) => {
        setUserList(res.ret.data);
      }
    );
  }, []);

  const handleChangeUser = (
    event: SyntheticEvent<Element, Event>,
    selectedUser: User | null
  ) => {
    setValue((prevValue) => {
      if (!prevValue) return prevValue;
      return {
        ...prevValue,
        user: {
          key: selectedUser?.pk,
          value: selectedUser?.username
        }
      };
    });
  };

  return (
    <>
      <CustomFormLabel sx={{ mt: 0 }} htmlFor="city-text">
        Хэрэглэгч
      </CustomFormLabel>
      <Autocomplete
        id="user"
        options={userList}
        getOptionLabel={(option) => option.username || option.value || ""}
        value={value?.user}
        onChange={handleChangeUser}
        renderInput={(params) => (
          <TextField {...params} label="User" variant="outlined" />
        )}
      />
    </>
  );
};

export default UserInput;
