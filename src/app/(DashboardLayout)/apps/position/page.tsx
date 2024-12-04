"use client";

import PageContainer from "@/app/components/container/PageContainer";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import ParentCard from "@/app/components/shared/ParentCard";
import SaveChangesDialog from "@/components/forms/saveChangesDialog";
import CustomTable from "@/components/table/table";
import TypoToolTip from "@/components/typography/typograpyToolTip";
import withAuth from "@/store/hooks/withAuth";
import { deleteRequest, postRequest } from "@/utils/network/handlers";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TableCell,
  TableRow
} from "@mui/material";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import { TableListFieldType } from "../../types/tms/common";
import * as Yup from "yup";
import { formatDate } from "@/utils/helpers";
import { PositionEdge, PositionType } from "../../types/apps/position";
import CustomSelectForm from "@/components/forms/CustomSelectForm";
import CustomTextFieldForm from "@/components/forms/CustomTextFieldForm";
import { PermissionEdge } from "../../types/apps/permission";

const BCrumb = [
  {
    to: "/",
    title: "Нүүр"
  },
  {
    title: "Албан тушаал"
  }
];

const ListFields: TableListFieldType[] = [
  { label: "uuid", key: "uuid", type: "text", visible: false },
  { label: "Албан тушаал", key: "name", type: "text", visible: true },
  { label: "Төлөв", key: "sourceDisplay", type: "text", visible: true },
  {
    label: "Эрх",
    key: "permissions",
    type: "text",
    visible: true
  },
  {
    label: "Хэрэглэгчийн төрөл",
    key: "userType",
    type: "text",
    visible: false
  },
  {
    label: "Хэрэглэгчийн төрөл",
    key: "userTypeDisplay",
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
    visible: true
  }
];

const GET_POSITIONS = gql`
  query Positions($first: Int, $offset: Int) {
    positions(first: $first, offset: $offset) {
      totalCount
      edgeCount
      edges {
        cursor
        node {
          uuid
          name
          userType
          userTypeDisplay
          createdDate
          createdUserName
          lastUpdatedDate
          lastUpdatedUserName
          status
          statusDisplay
          permissions {
            edges {
              node {
                uuid
                name
              }
            }
          }
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
    permissions {
      edges {
        node {
          uuid
          name
        }
      }
    }
  }
`;

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  permissions: Yup.array().of(Yup.string()).min(1),
  userType: Yup.string().required(),
  status: Yup.string().required()
});

const Position = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showSaveChangesDialog, setShowSaveChangesDialog] =
    useState<boolean>(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  const { data, fetchMore, loading } = useQuery(GET_POSITIONS, {
    variables: { first: rowsPerPage, offset: page * rowsPerPage }
  });

  const initialValues: PositionType = {
    uuid: "",
    name: "",
    userType: "",
    status: "ok",
    permissions: []
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const body = {
        hdr: {
          name: values.name,
          status: values?.status,
          user_type: values?.userType,
          permissions: values?.permissions
        }
      };
      if (isEdit) {
        updateHandler();
        return;
      }

      try {
        const res = await postRequest<PositionType>("/position/insert/", body);
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
    }
  });
  const {
    values,
    handleChange,
    dirty,
    resetForm,
    setValues,
    touched,
    errors,
    handleSubmit
  } = formik;

  const items = data?.positions?.edges.map((edge: PositionEdge) => edge.node);
  const permissions = data?.permissions?.edges.map(
    (edge: { node: { uuid?: string; name?: string; code?: string } }) =>
      edge.node
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
    setIsEdit(false);
    resetForm();
    setAnchorEl(null);
    setCreateDialogOpen(!createDialogOpen);
  };
  const handleClose = () => {
    if (dirty) {
      setShowSaveChangesDialog(true);
    } else {
      setCreateDialogOpen(false);
    }
  };
  const updateHandler = async () => {
    const body = {
      hdr: {
        name: values.name,
        status: values?.status,
        user_type: values?.userType,
        permissions: values?.permissions
      }
    };
    await postRequest<PositionType>(`/position/update/${values.uuid}/`, body)
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
  const editClickHandler = (row: PositionType) => {
    row = {
      ...row,
      permissions: Array.isArray(row.permissions)
        ? row.permissions
        : row.permissions?.edges.map(
            (permission: PermissionEdge) => permission.node.uuid
          ) || [],
      userType: row.userType?.toLowerCase(),
      status: row.status?.toLowerCase()
    };
    console.log(row);
    setValues(row);
    setCreateDialogOpen(true);
    setIsEdit(true);
  };

  const deleteClickHandler = (uuid: string) => async () => {
    await deleteRequest(`/position/delete/${uuid}/`)
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

  return (
    <PageContainer
      title="Албан тушаалын жагсаалт"
      description="Албан тушаалын жагсаалт"
    >
      <Breadcrumb title="Албан тушаалын жагсаалт" items={BCrumb} />
      <SaveChangesDialog
        onLeave={() => {
          setIsEdit(false);
          setCreateDialogOpen(false);
          resetForm();
        }}
        showSaveChangesDialog={showSaveChangesDialog}
        setShowSaveChangesDialog={setShowSaveChangesDialog}
      />
      <Dialog open={createDialogOpen} onClose={handleClose} fullWidth>
        <ParentCard
          title={isEdit ? "Албан тушаал засах" : "Албан тушаал бүртгэх"}
        >
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <CustomFormLabel
                sx={{
                  mt: 0
                }}
              >
                Албан тушаалын нэр
              </CustomFormLabel>
              <CustomTextFieldForm
                id="name"
                variant="outlined"
                name="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                value={values.name}
                onChange={handleChange}
                fullWidth
              />
              <CustomFormLabel sx={{ mt: 2 }}>
                Хэрэглэгчийн төрөл
              </CustomFormLabel>
              <CustomSelectForm
                id="userType"
                variant="outlined"
                name="userType"
                value={values.userType}
                error={touched.userType && Boolean(errors.userType)}
                onChange={handleChange}
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
              </CustomSelectForm>

              <CustomFormLabel sx={{ mt: 2 }}>Эрх</CustomFormLabel>
              <CustomSelectForm
                multiple
                id="permission"
                variant="outlined"
                name="permissions"
                value={values.permissions}
                error={touched.permissions && Boolean(errors.permissions)}
                onChange={handleChange}
                fullWidth
              >
                {permissions &&
                  permissions.map(
                    (permission: { uuid: string; name: string }) => {
                      return (
                        <MenuItem key={permission.uuid} value={permission.uuid}>
                          {permission.name}
                        </MenuItem>
                      );
                    }
                  )}
              </CustomSelectForm>
              <CustomFormLabel sx={{ mt: 2 }}>Төлөв</CustomFormLabel>
              <CustomSelectForm
                id="permission"
                variant="outlined"
                name="status"
                value={values.status}
                error={touched.status && Boolean(errors.status)}
                onChange={handleChange}
                fullWidth
              >
                {data?.statusChoices &&
                  data?.statusChoices.map(
                    (field: { key: string; value: string }) => {
                      return (
                        <MenuItem key={field.key} value={field.key}>
                          {field.value}
                        </MenuItem>
                      );
                    }
                  )}
              </CustomSelectForm>
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
          parentTitle="Албан тушаалын жагсаалт"
          totalCount={data?.positions?.totalCount}
          page={page}
          isLoading={loading}
          onPageChange={handleChangePage}
          fields={ListFields}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onClickCreate={onClickCreate}
        >
          {items?.map((row: PositionType, index: number) => (
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
                  {row.statusDisplay}
                </TypoToolTip>
              </TableCell>

              <TableCell>
                {!Array.isArray(row.permissions) &&
                  row?.permissions?.edges?.map(
                    (permission: PermissionEdge, index: number) => (
                      <TypoToolTip
                        key={index}
                        color="textSecondary"
                        fontSize={13}
                        fontWeight="500"
                      >
                        {permission.node.name}
                      </TypoToolTip>
                    )
                  )}
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
};
export default withAuth(Position);
