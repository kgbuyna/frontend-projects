"use client";

import { useState } from 'react';

import { Grid } from '@mui/material';

import {
  FbOrdinaryForm,
  FbDefaultForm,
  FbBasicHeaderForm,
  FbReadonlyForm,
  FbDisabledForm,
  FbLeftIconForm,
  FbRightIconForm,
  FbInputVariants,
} from '@/app/components/forms/form-layouts/index';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import AddressInput from '@/app/components/shared/AddressInput';
import ShoppingCenterInput from '@/app/components/shared/ShoppingCenterInput';
import POSProductTypeInput from '@/app/components/shared/POSProductTypeInput';
import { MerchantActivity } from '../../types/tms/merchant';
import { ShoppingCenter } from '../../types/tms/location';
import { Item } from '../../types/api';
import UserInput from '@/app/components/shared/UserInput';
import MerchantActivityInput from '@/app/components/shared/MerchantActivityInput';

const BCrumb = [
  {
    to: "/",
    title: "Home"
  },
  {
    title: "Form Layouts"
  }
];


type ProductType = {
  pk ?: number,
  code ?: string,
  status ?: string,
  name ?: string,
  is_home ?: boolean,
  pos_type?: string,

  key?: number,
  value?: string, 
}

type Person =  {
  name ?: string;
  age ?: number;
  address ?: string | '';
  city ?: Item | undefined;
  district ?: Item | undefined;
  quarter ?: Item | undefined;
  shoppingCenter?: Item | undefined;
  productType ?: Item | undefined;
  merchantActivity ?: Item | undefined;
  user ?: Item | undefined;
}

const FormLayouts = () => {
  const [person , setPerson] = useState<Person | null>({
    name: 'John Doe',
    age: 30,
    address: 'fadsf', 
    city: {
      key: 23,
      value: 'Улаанбаатар'
    },
    district: {
      key: 19,
      value: 'Баянзүрх'
    },
    quarter: {
      key: 45,
      value: '13-р хороо'
    },
    shoppingCenter: {
      key: 1,
      value: 'Төмөр замын газар',
    },
    productType:{
      key: 1, 
      value: 'Product type 1',
    }, 
    user:{
      key: 1,
      value: 'User 1',
    }
  });
  return (
  
  <PageContainer title="Form Layout" description="this is Form Layout">
      <Breadcrumb title="Form Layouts" items={BCrumb} />
        <h1>{person?.city?.value}</h1>
        <h1>{person?.district?.value}</h1>
        <h1>{person?.quarter?.value}</h1>
        <h1>{person?.address}</h1>
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} xs={12}>
          <AddressInput<Person> value={person} setValue={setPerson} haveAddressForm={true}/>
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <ShoppingCenterInput<Person> value={person} setValue={setPerson}/>
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <POSProductTypeInput<Person> value={person} setValue={setPerson}/>
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <UserInput<Person> value={person} setValue={setPerson}/>
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <MerchantActivityInput<Person> value={person} setValue={setPerson}></MerchantActivityInput>
        </Grid>
        

        <Grid item lg={6} md={12} xs={12}>
          <FbOrdinaryForm />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <FbInputVariants />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <FbDefaultForm />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <FbBasicHeaderForm />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <FbReadonlyForm />
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <FbDisabledForm />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <FbLeftIconForm />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <FbRightIconForm />
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default FormLayouts;
