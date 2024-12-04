import CustomFormLabel from "../forms/theme-elements/CustomFormLabel";

import Autocomplete from '@mui/material/Autocomplete';

import { Grid, TextField, TextFieldProps } from '@mui/material';
import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import { postRequest } from "@/utils/network/handlers";

type Props<T> = {
    value: T | null,
    setValue: Dispatch<SetStateAction<T | null>>
};

type ListData ={
    data: any[],
    records_filtered: number,
    records_total: number
}

type ProductType = {
    pk ?: number,
    code ?: string,
    status ?: string,
    name ?: string,
    is_home ?: boolean,
    pos_type ?: string,

    key?: number,
    value?: string, 
}
type pt = {
    productType ?: ProductType | undefined,
}
const updateBody = (rpp: number): any => {
    return {
        cnd: {},
        list: {
          rpp: rpp,
          page: 1,
          order: {
            name: -1
          },
        },
    }
}


const token="GLX9Fi0TtbNApfjbsNxwdB0Nnp3mAw";

const config= {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
};


const POSProductTypeInput = <T extends pt >({value , setValue}: Props<T>) => {
    const [productTypeList, setProductTypeList] = useState<readonly ProductType[]>([]);
    useEffect(() => {
        async function fetchData(){
            try {
                const productTypeList = await postRequest<ListData>('/tms/pos_product_type/list/', updateBody(60), config)
                setProductTypeList(productTypeList.ret.data)
            } catch (error) {
                console.error('Error making POST request:', error);
                throw new Error();
            }
        }
        fetchData();
    },[])
    const handleChangePOSProductType = (event: SyntheticEvent<Element, Event>, value: ProductType | null) => {
        
        setValue((prevValue) => {
            if(!prevValue) return prevValue
            return {
                ...prevValue,
                productType: {
                    key: value?.pk,
                    value: value?.name,
                }
            }
        })

    }


    return (
        <>
            <CustomFormLabel sx={{mt: 0}} htmlFor="city-text">Бүтээгдэхүүний төрөл:</CustomFormLabel>
            <Autocomplete
                id="city-select"
                options={productTypeList}
                getOptionLabel={(option) => option.name || option.value  || ''}
                noOptionsText="Илэрц олдсонгүй."
                clearText='Арилгах'
                onChange={handleChangePOSProductType}
                value={value?.productType}
                fullWidth
                renderInput={(params) => (   
                    <TextField {...params} />
                )}
            />  
        </>
    )

}

export default POSProductTypeInput;