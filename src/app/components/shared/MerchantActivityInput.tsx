import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";

import Autocomplete from '@mui/material/Autocomplete';

import { Grid, TextField, TextFieldProps } from '@mui/material';
import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import { postRequest } from "@/utils/network/handlers";
import { ListData } from "@/app/(DashboardLayout)/types/api";
import { MerchantActivity } from "@/app/(DashboardLayout)/types/tms/merchant";

type Props<T> = {
    value: T | null,
    setValue: Dispatch<SetStateAction<T | null>>
};

const token="GLX9Fi0TtbNApfjbsNxwdB0Nnp3mAw"
const config= {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
};

type MA = {
    merchantActivity ?: MerchantActivity,
}

const updateBody = (rpp: number): any => {
    return {
        cnd: {},
        list: {
          rpp: rpp,
          page: 1,
          order: {
            name: 1
          },
        },
    }
}

const MerchantActivityInput = <T extends MA >({value, setValue}: Props<T>) =>{
    const [merchantActivityList, setMerchantActivityList] = useState<readonly MerchantActivity[]>([]);

    const handleChangeMerchantActivity = (event: SyntheticEvent<Element, Event>, value: MerchantActivity | null) => {
        setValue((prevValue) => {
            if(!prevValue) return prevValue
            return {
                ...prevValue,
                merchantActivity: {
                    key: value?.pk,
                    value: value?.name,
                }
            }
        })
    };
    useEffect(() => {
        async function fetchData(){
            try {
                const merchantActivity = await postRequest<ListData>('/tms/merchant_activity/list/', updateBody(50), config)
                setMerchantActivityList(merchantActivity.ret.data)
            } catch (error) {
                console.error('Error making POST request:', error);
                throw new Error();
            }
        }
        fetchData();
    },[])

    return (
        <>
            <CustomFormLabel sx={{mt: 0}} htmlFor="city-text">Үйл ажиллагаа:</CustomFormLabel>
            <Autocomplete
                id="merchant-activity-select"
                options={merchantActivityList}
                getOptionLabel={(option) => option.name || option.value  || ''}
                noOptionsText="Илэрц олдсонгүй."
                clearText='Арилгах'
                onChange={handleChangeMerchantActivity}
                value={value?.merchantActivity}
                fullWidth
                renderInput={(params) => (   
                    <TextField {...params} />
                )}
            />  
        </>
    )
}
export default MerchantActivityInput;