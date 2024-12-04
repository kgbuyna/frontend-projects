"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import { formatDate } from "@/utils/helpers";
import { gql, useQuery } from "@apollo/client";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TableCell,
  TableRow
} from "@mui/material";
import { TableListFieldType } from "../../types/tms/common";

import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { deleteRequest, postRequest } from "@/utils/network/handlers";
import toast from "react-hot-toast";

import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTable from "@/components/table/table";

import ParentCard from "@/app/components/shared/ParentCard";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import SaveChangesDialog from "@/components/forms/saveChangesDialog";
import React, { useState } from "react";
import { NamespaceEdge, NamespaceType } from "../../types/apps/namespace";
import AddressInput from "@/app/components/shared/AddressInput";
import withAuth from "@/store/hooks/withAuth";
import CustomSelectForm from "@/components/forms/CustomSelectForm";
import CustomTextFieldForm from "@/components/forms/CustomTextFieldForm";

const BCrumb = [
  {
    to: "/",
    title: "Нүүр"
  },
  {
    title: "Системийн хэрэглэгчийн бүлэг"
  }
];
const ListFields: TableListFieldType[] = [
  { label: "uuid", key: "uuid", type: "text", visible: false },
  { label: "ААН-ийн нэр", key: "name", type: "text", visible: true },
  { label: "Код", key: "sourceDisplay", type: "text", visible: true },
  {
    label: "Хэрэглэгчийн төрөл",
    key: "userTypeDisplay",
    type: "text",
    visible: true
  },
  {
    label: "Утасны дугаар",
    key: "companyPhone",
    type: "number",
    visible: true
  },
  {
    label: "Call center утас",
    key: "callCenterPhone",
    type: "number",
    visible: true
  },
  {
    label: "Төлөв",
    key: "statusDisplay",
    type: "text",
    visible: true
  },
  { label: "Үүсгэсэн огноо", key: "createdDate", type: "date", visible: true },
  {
    label: "Үүсгэсэн хэрэглэгч",
    key: "createdUserName",
    type: "text",
    visible: true
  },
  {
    label: "Сүүлд зассан огноо",
    key: "lastUpdatedDate",
    type: "date",
    visible: true
  },
  {
    label: "Сүүлд зассан хэрэглэгч",
    key: "lastUpdatedUserName",
    type: "text",
    visible: true
  },
  {
    label: "Хяналт",
    key: "actions",
    type: "actions",
    actions: ["edit", "detail", "delete"],
    visible: true
  }
];

const GET_NAMESPACES = gql`
  query Namespaces($first: Int, $offset: Int) {
    namespaces(first: $first, offset: $offset) {
      totalCount
      edgeCount
      edges {
        cursor
        node {
          uuid
          source
          sourceDisplay
          name
          userType
          companyPhone
          callCenterPhone
          status
          city {
            uuid
            name
          }
          district {
            uuid
            name
          }
          nameShort
          address
          managerName
          managerPhone
          managerEmail
          developerName
          developerPhone
          developerEmail
          statusDisplay
          createdDate
          createdUserName
          lastUpdatedDate
          lastUpdatedUserName
          userTypeDisplay
        }
      }
    }
    userTypeChoices {
      key
      value
    }
    statusChoices {
      key
      value
    }
  }
`;

const validationSchema = Yup.object().shape({
  userType: Yup.string().required(),
  status: Yup.string().required(),
  name: Yup.string().required(),
  nameShort: Yup.string().nullable(),
  companyPhone: Yup.number().nullable(),
  city: Yup.object()
    .shape({
      uuid: Yup.string().required("City UUID is required"),
      name: Yup.string().required("City name is required")
    })
    .required(),
  district: Yup.object()
    .shape({
      uuid: Yup.string().required("District UUID is required"),
      name: Yup.string().required("District name is required")
    })
    .required(),
  address: Yup.string().nullable(),
  managerName: Yup.string().nullable(),
  managerPhone: Yup.number().nullable(),
  managerEmail: Yup.string().email().nullable(),
  developerName: Yup.string().nullable(),
  developerPhone: Yup.number().nullable(),
  developerEmail: Yup.string().email().nullable(),
  callCenterPhone: Yup.number().nullable()
});

function Namespace() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [actionMenuOpen, setActionMenuOpen] = React.useState<number | null>(
    null
  );
  const [showSaveChangesDialog, setShowSaveChangesDialog] =
    useState<boolean>(false);
  const { data, fetchMore, loading } = useQuery(GET_NAMESPACES, {
    variables: { first: rowsPerPage, offset: rowsPerPage * page }
  });

  const initialValues: NamespaceType = {
    userType: "",
    status: "",
    name: "",
    city: {
      uuid: "",
      name: ""
    },
    district: {
      uuid: "",
      name: ""
    },
    nameShort: null,
    companyPhone: null,
    callCenterPhone: null,
    address: null,
    managerName: null,
    managerPhone: null,
    managerEmail: null,
    developerName: null,
    developerPhone: null,
    developerEmail: null
  };

  const formik = useFormik<NamespaceType>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const body = {
        hdr: {
          user_type: values.userType,
          name: values.name,
          name_short: values.nameShort,
          company_phone: values.companyPhone,
          city: values.city.uuid,
          district: values.district.uuid,
          address: values.address,
          manager_name: values.managerName,
          manager_phone: values.managerPhone,
          manager_email: values.managerEmail,
          developer_name: values.developerName,
          developer_phone: values.developerPhone,
          developer_email: values.developerEmail,
          status: values.status,
          call_center_phone: values.callCenterPhone
        }
      };
      if (isEdit) {
        updateHandler();
        return;
      }
      try {
        const res = await postRequest<NamespaceType>(
          "/namespace/insert/",
          body
        );
        if (res.status_code == "ok") {
          toast.success("Амжилттай бүртгэгдлээ.", {
            position: "top-right",
            duration: 3000
          });
          fetchMore({
            variables: {
              first: rowsPerPage
            }
          });

          resetForm();
          setCreateDialogOpen(false);
        } else if (res.status_code == "ng") {
          if (res?.msg)
            toast.error(res.msg.body, {
              position: "top-right",
              duration: 3000
            });
        }
      } catch (error) {
        console.error("Error inserting permission:", error);
      }
    }
  });
  const {
    values,
    handleChange,
    dirty,
    resetForm,
    setValues,
    errors,
    touched,
    handleSubmit
  } = formik;

  const items = data?.namespaces?.edges.map((edge: NamespaceEdge) => edge.node);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rpp = parseInt(event.target.value);
    setPage(0);
    setRowsPerPage(rpp);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const onClickCreate = () => {
    setIsEdit(false);
    resetForm();
    setAnchorEl(null);
    setCreateDialogOpen(!createDialogOpen);
  };
  const handleClose = () => {
    dirty ? setShowSaveChangesDialog(true) : setCreateDialogOpen(false);
  };

  const updateHandler = async () => {
    const body = {
      hdr: {
        user_type: values?.userType?.toLowerCase(),
        name: values.name,
        name_short: values.nameShort,
        company_phone: values.companyPhone,
        city: values.city.uuid,
        district: values.district.uuid,
        address: values.address,
        manager_name: values.managerName,
        manager_phone: values.managerPhone,
        manager_email: values.managerEmail,
        developer_name: values.developerName,
        developer_phone: values.developerPhone,
        developer_email: values.developerEmail,
        status: values.status?.toLowerCase(),
        call_center_phone: values.callCenterPhone
      }
    };
    try {
      const res = await postRequest<NamespaceType>(
        `/namespace/update/${values.uuid}/`,
        body
      );
      if (res.status_code == "ok") {
        toast.success("Амжилттай шинэчлэгдлээ.", {
          position: "top-right",
          duration: 3000
        });
        fetchMore({
          variables: {
            first: rowsPerPage
          }
        });

        resetForm();
        setCreateDialogOpen(false);
      } else if (res.status_code == "ng") {
        if (res?.msg)
          toast.error(res.msg.body, {
            position: "top-right",
            duration: 3000
          });
      }
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };

  const editClickHandler = (row: NamespaceType) => {
    setIsEdit(true);
    setValues(row);
    setCreateDialogOpen(true);
  };

  const deleteClickHandler = (uuid: string) => async () => {
    try {
      await deleteRequest(`/namespace/delete/${uuid}`);
      fetchMore({
        variables: {
          first: rowsPerPage
        }
      });
      toast.success("Амжилттай устгагдлаа.", {
        position: "top-right",
        duration: 3000
      });
      setAnchorEl(null);
    } catch (e) {
      console.error("Error deleting permission:", e);
    }
  };

  return (
    <PageContainer title="Namespace" description="Namespace">
      <Breadcrumb title="Системийн хэрэглэгчийн бүлэг" items={BCrumb} />
      <SaveChangesDialog
        onLeave={() => {
          setCreateDialogOpen(false);
          resetForm();
        }}
        showSaveChangesDialog={showSaveChangesDialog}
        setShowSaveChangesDialog={setShowSaveChangesDialog}
      />
      <Dialog
        open={createDialogOpen}
        onClose={handleClose}
        fullWidth
        scroll="body"
      >
        <ParentCard
          title={
            isEdit
              ? "Системийн хэрэглэгчийн бүлэг засах"
              : "Системийн хэрэглэгчийн бүлэг бүртгэх"
          }
        >
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container rowSpacing={1} columnSpacing={2}>
                <Grid item lg={6} md={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                    htmlFor="userType"
                  >
                    Хэрэглэгчийн төрөл
                  </CustomFormLabel>
                  <CustomSelectForm
                    id="userType"
                    variant="outlined"
                    name="userType"
                    value={values?.userType?.toLowerCase()}
                    error={touched.userType && Boolean(errors.userType)}
                    onChange={handleChange}
                    fullWidth
                  >
                    {data?.userTypeChoices &&
                      data?.userTypeChoices.map(
                        (
                          field: { key: string; value: string },
                          index: number
                        ) => {
                          return (
                            <MenuItem key={index} value={field.key}>
                              {field.value}
                            </MenuItem>
                          );
                        }
                      )}
                  </CustomSelectForm>
                </Grid>

                <Grid item lg={6} md={6} xs={12}>
                  <CustomFormLabel sx={{ mt: 0 }}>Төлөв</CustomFormLabel>
                  <CustomSelectForm
                    id="status"
                    variant="outlined"
                    name="status"
                    value={values.status?.toLowerCase()}
                    error={touched.status && Boolean(errors.status)}
                    onChange={handleChange}
                    fullWidth
                  >
                    {data?.statusChoices &&
                      data?.statusChoices.map(
                        (
                          field: { key: string; value: string },
                          index: number
                        ) => {
                          return (
                            <MenuItem key={index} value={field.key}>
                              {field.value}
                            </MenuItem>
                          );
                        }
                      )}
                  </CustomSelectForm>
                </Grid>

                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                    htmlFor="name"
                  >
                    ААН-ийн нэр
                  </CustomFormLabel>
                  <CustomTextFieldForm
                    id="name"
                    variant="outlined"
                    name="name"
                    value={values.name}
                    error={touched.name && Boolean(errors.name)}
                    helperText={errors.name}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                  >
                    Товчилсон нэр
                  </CustomFormLabel>

                  <CustomTextField
                    id="nameShort"
                    variant="outlined"
                    name="nameShort"
                    value={values.nameShort}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                  >
                    Утасны дугаар
                  </CustomFormLabel>

                  <CustomTextFieldForm
                    id="companyPhone"
                    variant="outlined"
                    name="companyPhone"
                    type="number"
                    value={values.companyPhone}
                    error={touched.companyPhone && Boolean(errors.companyPhone)}
                    helperText={errors.companyPhone}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <CustomFormLabel sx={{ mt: 0 }}>
                    Call center утас
                  </CustomFormLabel>
                  <CustomTextFieldForm
                    id="callCenterPhone"
                    variant="outlined"
                    name="callCenterPhone"
                    type="number"
                    value={values.callCenterPhone}
                    error={
                      touched.callCenterPhone && Boolean(errors.callCenterPhone)
                    }
                    helperText={errors.callCenterPhone}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
              </Grid>
              <Grid container rowSpacing={1} columnSpacing={2}>
                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                  >
                    Менежерийн нэр
                  </CustomFormLabel>

                  <CustomTextField
                    id="managerName"
                    variant="outlined"
                    name="managerName"
                    value={values.managerName}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                  >
                    Менежерийн утасны дугаар
                  </CustomFormLabel>

                  <CustomTextFieldForm
                    id="managerPhone"
                    variant="outlined"
                    name="managerPhone"
                    type="number"
                    value={values.managerPhone}
                    error={touched.managerPhone && Boolean(errors.managerPhone)}
                    helperText={errors.managerPhone}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                  >
                    Менежерийн имэйл хаяг
                  </CustomFormLabel>

                  <CustomTextFieldForm
                    id="managerEmail"
                    variant="outlined"
                    name="managerEmail"
                    value={values.managerEmail}
                    error={touched.managerEmail && Boolean(errors.managerEmail)}
                    helperText={errors.managerEmail}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} xs={0}></Grid>

                <Grid item lg={12} xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                  >
                    Хөгжүүлэгчийн нэр
                  </CustomFormLabel>

                  <CustomTextField
                    id="developerName"
                    variant="outlined"
                    name="developerName"
                    value={values.developerName}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                  >
                    Хөгжүүлэгчийн утасны дугаар
                  </CustomFormLabel>

                  <CustomTextFieldForm
                    id="developerPhone"
                    variant="outlined"
                    name="developerPhone"
                    type="number"
                    value={values.developerPhone}
                    error={
                      touched.developerPhone && Boolean(errors.developerPhone)
                    }
                    helperText={errors.developerPhone}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0
                    }}
                  >
                    Хөгжүүлэгчийн имэйл хаяг
                  </CustomFormLabel>

                  <CustomTextFieldForm
                    id="developerEmail"
                    variant="outlined"
                    name="developerEmail"
                    value={values.developerEmail}
                    error={
                      touched.developerEmail && Boolean(errors.developerEmail)
                    }
                    helperText={errors.developerEmail}
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange(event);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} xs={0}></Grid>

                <Grid item lg={12} xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
              </Grid>
              <AddressInput<NamespaceType>
                hasQuarter={false}
                hasAddressForm={true}
                setValue={setValues}
                value={values}
                error={{
                  city: touched.city ? Boolean(errors?.city) : false,
                  district: touched.district ? Boolean(errors?.district) : false
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                }}
              >
                Хаах
              </Button>
              <Button variant="contained" type="submit">
                {isEdit ? "Засах" : "Бүртгэх"}
              </Button>
            </DialogActions>
          </form>
        </ParentCard>
      </Dialog>
      <Box>
        <CustomTable
          totalCount={data?.namespaces.totalCount ?? 0}
          page={page}
          isLoading={loading}
          onPageChange={handleChangePage}
          fields={ListFields}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onClickCreate={onClickCreate}
        >
          {items?.map((row: NamespaceType, index: number) => (
            <TableRow key={index} hover>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.name}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.sourceDisplay}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.userTypeDisplay}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.companyPhone}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.callCenterPhone}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.statusDisplay}
                </TypoToolTip>
              </TableCell>

              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {String(formatDate(row.createdDate))}
                </TypoToolTip>
              </TableCell>

              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.createdUserName}
                </TypoToolTip>
              </TableCell>

              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {String(formatDate(row.lastUpdatedDate))}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {row.lastUpdatedUserName}
                </TypoToolTip>
              </TableCell>

              <TableCell>
                <>
                  <IconButton
                    id={`basic-button-${index}`}
                    aria-controls={
                      actionMenuOpen === index ? "basic-menu" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={
                      actionMenuOpen === index ? "true" : undefined
                    }
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      setAnchorEl(event.currentTarget);
                      setActionMenuOpen(index); // Set the open menu to the current row's index
                    }}
                  >
                    <IconDotsVertical width={18} />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={actionMenuOpen === index}
                    onClose={() => {
                      setAnchorEl(null);
                      setActionMenuOpen(null);
                    }}
                    MenuListProps={{
                      "aria-labelledby": "basic-button"
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        editClickHandler(row);
                      }}
                    >
                      <ListItemIcon>
                        <IconEdit width={18} />
                      </ListItemIcon>
                      Засах
                    </MenuItem>
                    <MenuItem onClick={deleteClickHandler(row.uuid as string)}>
                      <ListItemIcon>
                        <IconTrash width={18} />
                      </ListItemIcon>
                      Устгах
                    </MenuItem>
                  </Menu>
                </>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      </Box>
    </PageContainer>
  );
}

export default withAuth(Namespace);
