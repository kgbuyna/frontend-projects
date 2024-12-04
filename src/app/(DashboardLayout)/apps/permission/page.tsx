"use client";
import React, { useState } from "react";

import * as Yup from "yup";
import { useFormik } from "formik";

import { gql, useQuery } from "@apollo/client";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton, ListItemIcon,
  Menu,
  MenuItem,
  TableCell,
  TableRow
} from "@mui/material";
import { PermissionType, PermissionEdge } from "../../types/apps/permission";
import { TableListFieldType } from "../../types/tms/common";

import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { deleteRequest, postRequest } from "@/utils/network/handlers";
import toast from "react-hot-toast";

import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTable from "@/components/table/table";

import ParentCard from "@/app/components/shared/ParentCard";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import SaveChangesDialog from "@/components/forms/saveChangesDialog";
import withAuth from "@/store/hooks/withAuth";
import { formatDate } from "@/utils/helpers";

const BCrumb = [
  {
    to: "/",
    title: "Нүүр"
  },
  {
    title: "Эрхийн жагсаалт"
  }
];
const ListFields: TableListFieldType[] = [
  { label: "Нэр", key: "name", type: "text", visible: true },
  { label: "Код", key: "code", type: "text", visible: true },
  {
    label: "Хэрэглэгчийн төрөл",
    key: "userTypes",
    type: "text",
    visible: true
  },
  { label: "Үүсгэсэн огноо", key: "createdDate", type: "text", visible: true },
  {
    label: "Үүсгэсэн хэрэглэгч",
    key: "createdUserName",
    type: "text",
    visible: true
  },
  {
    label: "Сүүлд зассан огноо",
    key: "lastUpdatedDate",
    type: "text",
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

const GET_PERMISSIONS = gql`
  query Permissions($first: Int, $offset: Int) {
    permissions(first: $first, offset: $offset) {
      totalCount
      edgeCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          uuid
          sourceDisplay
          name
          code
          userTypes
          createdDate
          createdUserName
          lastUpdatedDate
          lastUpdatedUserName
        }
      }
    }
    userTypeChoices {
      key
      value
    }
  }
`;

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  userTypes: Yup.array()
    .of(Yup.string().required("User type is required"))
    .min(1, "User type is required")
});

const Permission = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [emptyCols, setEmptyCols] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showSaveChangesDialog, setShowSaveChangesDialog] =
    useState<boolean>(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  const { data, fetchMore, loading } = useQuery(GET_PERMISSIONS, {
    variables: { first: rowsPerPage, offset: page * rowsPerPage }
  });

  const initialValues: PermissionType = {
    uuid: "",
    name: "",
    code: "",
    userTypes: []
  };

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    }
  });
  const { values, handleChange, dirty, validateForm, resetForm, setValues } =
    formik;

  const items = data?.permissions?.edges.map(
    (edge: PermissionEdge) => edge.node
  );
  const userTypeChoicesDict: Record<string, string> = {};
  data?.userTypeChoices?.map((choice: { key: string; value: string }) => {
    userTypeChoicesDict[choice.key] = choice.value;
  });
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
    setAnchorEl(null);
    setCreateDialogOpen(!createDialogOpen);
  };
  const handleClose = () => {
    if (dirty) {
      setShowSaveChangesDialog(true);
    } else {
      setIsEdit(false);
      setCreateDialogOpen(false);
    }
    setEmptyCols([]);
  };
  const updateHandler = async () => {
    const body = {
      hdr: {
        name: values.name,
        code: values.code,
        user_types: values.userTypes
      }
    };
    await postRequest<PermissionType>(
      `/permission/update/${values.uuid}/`,
      body
    )
      .then((res) => {
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
          setEmptyCols([]);
          setCreateDialogOpen(false);
        } else if (res.status_code == "ng") {
          if (res?.msg)
            toast.error(res?.msg.body, {
              position: "top-right",
              duration: 3000
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const editClickHandler = (row: PermissionType) => {
    setValues(row);
    setCreateDialogOpen(true);
    setIsEdit(true);
  };

  const deleteClickHandler = (uuid: string) => async () => {
    await deleteRequest(`/permission/delete/${uuid}/`)
      .then((res) => {
        if (res.status_code == "ok") {
          toast.success("Амжилттай устгагдлаа.", {
            position: "top-right",
            duration: 3000
          });
          fetchMore({
            variables: {
              first: rowsPerPage
            }
          });
        } else if (res.status_code == "ng") {
          if (res?.msg)
            toast.error(res?.msg.body, {
              position: "top-right",
              duration: 3000
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitHandler = async () => {
    const validatedForm = await validateForm(values);
    let emptyCols: string[] = [];
    Object.keys(validatedForm).map((key) => {
      emptyCols.push(key);
    });
    if (emptyCols.length > 0) {
      setEmptyCols(emptyCols);
      return;
    }
    const body = {
      hdr: {
        name: values.name,
        code: values.code,
        user_types: values.userTypes
      }
    };
    if (isEdit) {
      updateHandler();
      return;
    }
    try {
      const res = await postRequest<PermissionType>(
        "/permission/insert/",
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
        setEmptyCols([]);
        setCreateDialogOpen(false);
      } else if (res?.status_code == "ng") {
        if (res?.msg)
          toast.error(res?.msg?.body, {
            position: "top-right",
            duration: 3000
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer title="Эрхийн жагсаалт" description="Эрхийн жагсаалт">
      <Breadcrumb title="Эрхийн жагсаалт" items={BCrumb} />
      <SaveChangesDialog
        onLeave={() => {
          setIsEdit(false);
          setCreateDialogOpen(false);
          resetForm();
          setEmptyCols([]);
        }}
        showSaveChangesDialog={showSaveChangesDialog}
        setShowSaveChangesDialog={setShowSaveChangesDialog}
      />
      <Dialog open={createDialogOpen} onClose={handleClose} fullWidth>
        <ParentCard title={isEdit ? "Эрх засах" : "Эрх бүртгэх"}>
          <form onSubmit={submitHandler}>
            <DialogContent>
              <CustomFormLabel
                sx={{
                  mt: 0
                }}
              >
                Эрхийн нэр
              </CustomFormLabel>

              <CustomTextField
                id="name"
                variant="outlined"
                name="name"
                value={values.name}
                error={emptyCols.includes("name")}
                onChange={(
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => {
                  handleChange(event);
                }}
                fullWidth
              />
              <CustomFormLabel>Эрхийн код</CustomFormLabel>
              <CustomTextField
                id="code"
                variant="outlined"
                name="code"
                value={values.code}
                error={emptyCols.includes("code")}
                onChange={(
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => {
                  handleChange(event);
                }}
                fullWidth
              />
              <CustomFormLabel>Хэрэглэгчийн төрөл</CustomFormLabel>
              <CustomSelect
                multiple
                id="userTypes"
                variant="outlined"
                name="userTypes"
                value={values.userTypes}
                error={emptyCols.includes("userTypes")}
                onChange={(
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => {
                  handleChange(event);
                }}
                fullWidth
              >
                {data?.userTypeChoices &&
                  data?.userTypeChoices.map(
                    (field: { key: string; value: string }, index: number) => {
                      return (
                        <MenuItem key={index} value={field.key}>
                          {field.value}
                        </MenuItem>
                      );
                    }
                  )}
              </CustomSelect>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                }}
              >
                Хаах
              </Button>
              <Button variant="contained" onClick={submitHandler}>
                {isEdit ? "Засах" : "Бүртгэх"}
              </Button>
            </DialogActions>
          </form>
        </ParentCard>
      </Dialog>
      <Box>
        <CustomTable
          totalCount={data?.permissions?.totalCount}
          page={page}
          isLoading={loading}
          onPageChange={handleChangePage}
          fields={ListFields}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onClickCreate={onClickCreate}
        >
          {items?.map((row: PermissionType, index: number) => (
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
                  {row.code}
                </TypoToolTip>
              </TableCell>
              <TableCell>
                {Array.isArray(row?.userTypes) &&
                  row?.userTypes?.map((userType: string, key: number) => (
                    <TypoToolTip
                      key={key}
                      color="textSecondary"
                      fontSize={13}
                      fontWeight="500"
                    >
                      {userTypeChoicesDict[userType]}
                    </TypoToolTip>
                  ))}
              </TableCell>
              <TableCell>
                <TypoToolTip
                  color="textSecondary"
                  fontSize={13}
                  fontWeight="500"
                >
                  {formatDate(row.createdDate)}
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
                  {formatDate(row.lastUpdatedDate)}
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
                <IconButton
                  id={`basic-button-${index}`}
                  aria-controls={
                    actionMenuOpen === index ? "basic-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={actionMenuOpen === index ? "true" : undefined}
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
                    setActionMenuOpen(null); // Reset the menu open state
                  }}
                  MenuListProps={{
                    "aria-labelledby": `basic-button-${index}`
                  }}
                >
                  <MenuItem onClick={() => editClickHandler(row)}>
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
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      </Box>
    </PageContainer>
  );
};

export default withAuth(Permission);
