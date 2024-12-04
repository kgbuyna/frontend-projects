"use client";
import { UserType } from "@/app/(DashboardLayout)/types/apps/users";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelectForm from "@/components/forms/CustomSelectForm";
import CustomTextFieldForm from "@/components/forms/CustomTextFieldForm";
import { gql, useQuery } from "@apollo/client";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { useFormik } from "formik";

import { PositionType } from "@/app/(DashboardLayout)/types/apps/position";
import { postRequest } from "@/utils/network/handlers";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import RemoveCircleOutlineTwoToneIcon from "@mui/icons-material/RemoveCircleOutlineTwoTone";
import { useRouter } from "next/navigation";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { useParams } from "next/navigation";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { IconChevronLeft } from "@tabler/icons-react";

const validationSchema = Yup.object().shape({
  phone: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  status: Yup.string().required(),
  lastName: Yup.string().required(),
  firstName: Yup.string().required(),
  userType: Yup.string().required()
});

const namespacePositionValidationSchema = Yup.object().shape({
  namespacePositions: Yup.array()
    .of(
      Yup.object().shape({
        namespace: Yup.string().required("Namespace is required"),
        position: Yup.array()
          .of(Yup.string())
          .test(
            "first-element-not-null",
            "Энэ талбарыг бөглөх шаардлагатай",
            function (value) {
              return value && value.length > 0 && value[0];
            }
          )
      })
    )
    .min(1, "Энэ талбарыг бөглөх шаардлагатай.")
});

const passwordValidationSchema = Yup.object().shape({
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Нууц үг тохирохгүй байна.")
});

const GET_USER = gql`
  query Users($id: String!) {
    user(id: $id) {
      username
      firstName
      lastName
      email
      source
      userType
      phone
      status
      pk
      sourceDisplay
      userTypeDisplay
      statusDisplay
      name
      usernamespacepositionSet {
        edges {
          node {
            namespace {
              uuid
              name
            }
            position {
              name
              uuid
            }
          }
        }
      }
    }
    positions {
      edges {
        node {
          uuid
          name
          userType
        }
      }
    }
    namespaces {
      edges {
        node {
          uuid
          userType
          name
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

interface NamespaceType {
  uuid: string;
  userType: string;
  name: string;
}
const passwordInitialValues: { password: string; confirmPassword: string } = {
  password: "",
  confirmPassword: ""
};

const namespaceInitialValues: {
  namespacePositions: { namespace: string; position: string[] }[];
} = {
  namespacePositions: []
};

const initialValues: UserType = {
  pk: "",
  name: "",
  status: "ok",
  phone: "",
  username: "",
  email: "",
  lastName: "",
  firstName: "",
  userType: ""
};

const EditUser = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, loading } = useQuery(GET_USER, {
    variables: {
      id: id
    }
  });
  const [dirty, setDirty] = useState<boolean>(false);
  const [dirtyConfig, setDirtyConfig] = useState<boolean>(false);

  const [tempSelectedPosition, setTempSelectedPosition] = useState<{
    namespace: string;
    position: string[];
  }>({ namespace: "", position: [""] });

  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const namespaces: NamespaceType[] =
    data?.namespaces?.edges.map((edge: { node: NamespaceType }) => edge.node) ??
    [];
  const positions: PositionType[] =
    data?.positions?.edges.map((edge: { node: PositionType }) => edge.node) ??
    [];

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const body = {
        hdr: {
          status: values?.status,
          user_type: values?.userType,
          phone: values.phone,
          username: values.username,
          email: values.email,
          last_name: values.lastName,
          first_name: values.firstName,
          password: values.password
        }
      };
      try {
        const res = await postRequest(`/user/update/${id}/`, body);
        if (res.status_code === "ok") {
          toast.success("Амжилттай хадгалагдлаа.", {
            position: "top-right",
            duration: 3000
          });
          setDirty(false);
        } else if (res.status_code == "ng") {
          if (res?.msg)
            toast.error(res.msg.body, {
              position: "top-right",
              duration: 3000
            });
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
  const namespacePositionFormik = useFormik({
    initialValues: namespaceInitialValues,
    validationSchema: namespacePositionValidationSchema,
    onSubmit: () => {
      const body = {
        configs: {
          namespace_position: [] as { namespace: string; position: string }[]
        }
      };

      namespacePositionFormik.values?.namespacePositions?.forEach(
        (namespacePosition) => {
          namespacePosition.position.forEach((position) => {
            if (position)
              body.configs.namespace_position.push({
                namespace: namespacePosition.namespace,
                position: position
              });
          });
        }
      );

      postRequest(`/user/config/${id}/`, body)
        .then((res) => {
          if (res.status_code === "ok") {
            toast.success("Амжилттай хадгалагдлаа.", {
              position: "top-right",
              duration: 3000
            });
            setDirtyConfig(false);
          } else if (res.status_code == "ng") {
            if (res?.msg)
              toast.error(res.msg.body, {
                position: "top-right",
                duration: 3000
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const passwordFormik = useFormik({
    initialValues: passwordInitialValues,
    validationSchema: passwordValidationSchema,
    onSubmit: async () => {
      const res = await postRequest(`/user/password/${id}/`, {
        hdr: {
          password: passwordFormik.values.password
        }
      });
      if (res.status_code === "ok") {
        toast.success("Амжилттай хадгалагдлаа.", {
          position: "top-right",
          duration: 3000
        });
        passwordFormik.setValues({
          password: "",
          confirmPassword: ""
        });
        passwordFormik.setTouched({
          password: false,
          confirmPassword: false
        });
        // router.back();
      } else if (res.status_code == "ng") {
        if (res?.msg)
          toast.error(res.msg.body, {
            position: "top-right",
            duration: 3000
          });
      }
    }
  });
  const { values, handleChange, setValues, touched, errors } = formik;

  useEffect(() => {
    setValues({
      email: data?.user?.email || "",
      firstName: data?.user?.firstName || "",
      lastName: data?.user?.lastName || "",
      phone: data?.user?.phone || "",
      status: data?.user?.status.toLowerCase() || "",
      userType: data?.user?.userType.toLowerCase() || "",
      username: data?.user?.username || ""
    });

    let namespacePositions: { namespace: string; position: string[] }[] = [];
    data?.user?.usernamespacepositionSet?.edges.map(
      (edge: {
        node: { namespace: { uuid: string }; position: { uuid: string } };
      }) => {
        const namespace = edge.node.namespace.uuid;
        const position = edge.node.position.uuid;
        const index = namespacePositions.findIndex(
          (np) => np.namespace === namespace
        );
        if (index === -1) {
          namespacePositions.push({
            namespace: namespace,
            position: [position]
          });
        } else {
          namespacePositions[index].position.push(position);
        }
      }
    );
    namespacePositionFormik.setValues({
      namespacePositions: namespacePositions
    });
  }, [loading]);

  const label = 4;
  const form = 7;

  const pickedNamespace =
    namespacePositionFormik.values.namespacePositions?.map(
      (namespacePosition) => namespacePosition.namespace
    ) || [];

  return (
    <Card
      sx={{
        padding: 0,
        border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none"
      }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? "outlined" : undefined}
    >
      <Stack height={50} p={2} direction={"row"} alignItems={"center"}>
        <IconButton color="primary" onClick={() => router.back()}>
          <IconChevronLeft />
        </IconButton>
        <Typography variant="h5">Хэрэглэгчийн мэдээлэл засах</Typography>
      </Stack>

      <Divider />

      <CardContent>
        <Grid container xs={12}>
          <CardContent sx={{ mt: -0.5, pb: 0 }}>
            <Typography variant="h6" mb={3}>
              Хэрэглэгчийн мэдээлэл
            </Typography>
            <Grid container xs={11.5}>
              {/* column1 */}
              <Grid item lg={6} xs={12}>
                <form
                  onSubmit={(e: React.ChangeEvent<any>) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                >
                  <Grid container rowSpacing={2}>
                    <Grid item lg={label}>
                      <CustomFormLabel sx={{ mt: 0 }}>Төлөв</CustomFormLabel>
                    </Grid>
                    <Grid item lg={form}>
                      <Select
                        id="status"
                        variant="outlined"
                        name="status"
                        value={values.status}
                        error={touched.status && Boolean(errors.status)}
                        onChange={(event: SelectChangeEvent) => {
                          setDirty(true);
                          handleChange(event);
                        }}
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
                      </Select>
                    </Grid>

                    <Grid item lg={label}>
                      <CustomFormLabel
                        sx={{
                          mt: 0
                        }}
                      >
                        Овог
                      </CustomFormLabel>
                    </Grid>
                    <Grid item lg={form}>
                      <CustomTextFieldForm
                        id="lastName"
                        variant="outlined"
                        name="lastName"
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        value={values.lastName}
                        onChange={(event: ChangeEvent) => {
                          setDirty(true);
                          handleChange(event);
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item lg={label}>
                      <CustomFormLabel sx={{ mt: 0 }}>Нэр</CustomFormLabel>
                    </Grid>
                    <Grid item lg={form}>
                      <CustomTextFieldForm
                        id="firstName"
                        variant="outlined"
                        name="firstName"
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        value={values.firstName}
                        onChange={(event: ChangeEvent) => {
                          setDirty(true);
                          handleChange(event);
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item lg={label}>
                      <CustomFormLabel sx={{ mt: 0 }}>
                        Имэйл хаяг
                      </CustomFormLabel>
                    </Grid>
                    <Grid item lg={form}>
                      <CustomTextFieldForm
                        id="email"
                        variant="outlined"
                        name="email"
                        value={values.email}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        onChange={(event: ChangeEvent) => {
                          setDirty(true);
                          handleChange(event);
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item lg={label}>
                      <CustomFormLabel sx={{ mt: 0 }}>Утас</CustomFormLabel>
                    </Grid>
                    <Grid item lg={form}>
                      <CustomTextFieldForm
                        id="phone"
                        variant="outlined"
                        name="phone"
                        type="number"
                        value={values.phone}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        onChange={(event: ChangeEvent) => {
                          setDirty(true);
                          handleChange(event);
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item lg={label + form}>
                      <Stack
                        direction="row"
                        justifyContent={"flex-end"}
                        spacing={2}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={!dirty}
                        >
                          Хадгалах
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              </Grid>

              {/* column2 */}
              <Grid item lg={6} xs={12}>
                <form
                  onSubmit={(e: React.ChangeEvent<any>) => {
                    console.log("submitting");
                    e.preventDefault();
                    passwordFormik.handleSubmit();
                  }}
                >
                  <Grid container rowSpacing={2}>
                    <Grid item lg={label}>
                      <CustomFormLabel sx={{ mt: 0 }}>
                        Нэвтрэх нэр
                      </CustomFormLabel>
                    </Grid>
                    <Grid item lg={form}>
                      <CustomTextFieldForm
                        id="username"
                        variant="outlined"
                        name="username"
                        // error={touched.username && Boolean(errors.username)}
                        // helperText={touched.username && errors.username}
                        value={values.username}
                        // onChange={handleChange}
                        fullWidth
                        disabled
                      />
                    </Grid>

                    <Grid item lg={label}>
                      <CustomFormLabel sx={{ mt: 0 }}>Нууц үг</CustomFormLabel>
                    </Grid>
                    <Grid item lg={form}>
                      <CustomTextFieldForm
                        id="password"
                        variant="outlined"
                        name="password"
                        type="password"
                        value={passwordFormik.values.password}
                        error={
                          passwordFormik.touched.password &&
                          Boolean(passwordFormik.errors.password)
                        }
                        helperText={
                          passwordFormik.touched.password &&
                          passwordFormik.errors.password
                        }
                        onChange={passwordFormik.handleChange}
                        fullWidth
                      />
                    </Grid>

                    <Grid item lg={label}>
                      <CustomFormLabel sx={{ mt: -1 }}>
                        Нууц үг давтан оруулах
                      </CustomFormLabel>
                    </Grid>
                    <Grid item lg={form}>
                      <CustomTextFieldForm
                        id="confirmPassword"
                        variant="outlined"
                        name="confirmPassword"
                        type="password"
                        value={passwordFormik.values.confirmPassword}
                        error={
                          passwordFormik.touched.confirmPassword &&
                          Boolean(passwordFormik.errors.confirmPassword)
                        }
                        helperText={
                          passwordFormik.touched.confirmPassword &&
                          passwordFormik.errors.confirmPassword
                        }
                        onChange={passwordFormik.handleChange}
                        fullWidth
                      />
                    </Grid>
                    {/* placeholders */}
                    <Grid item lg={label + form}>
                      <CustomTextFieldForm sx={{ opacity: 0 }} fullWidth />
                    </Grid>
                    <Grid item lg={label + form}>
                      <CustomTextFieldForm sx={{ opacity: 0 }} fullWidth />
                    </Grid>
                    {/* submit button */}
                    <Grid item lg={label + form}>
                      <Stack
                        direction="row"
                        justifyContent={"flex-end"}
                        spacing={2}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={
                            !Boolean(
                              passwordFormik.values.confirmPassword.length &&
                                passwordFormik.values.password.length
                            )
                          }
                        >
                          Хадгалах
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ mt: 3, mb: 1 }} />
              </Grid>

              <Typography
                variant="h6"
                mt={4.5}
                mb={4.5}
                sx={{ display: "absolute", left: 0 }}
              >
                Хэрэглэгчийн тохиргоо
              </Typography>
              <Grid item lg={12}>
                <Grid item lg={6} xs={12}>
                  <Grid container rowSpacing={2}>
                    <Grid item xs={12} sm={label}>
                      <CustomFormLabel sx={{ mt: 0 }}>
                        Хэрэглэгчийн төрөл
                      </CustomFormLabel>
                    </Grid>
                    <Grid item xs={12} sm={form}>
                      <CustomSelectForm
                        id="status"
                        variant="outlined"
                        name="userType"
                        value={values.userType}
                        onChange={(event: SelectChangeEvent<unknown>) => {
                          setTempSelectedPosition({
                            namespace: "",
                            position: [""]
                          });
                          namespacePositionFormik.setValues((prevValues) => {
                            return {
                              ...prevValues,
                              namespacePositions: []
                            };
                          });
                          namespacePositionFormik.handleChange(event);
                        }}
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={11.5}>
                <Table
                  sx={{
                    opacity: values.userType ? 1 : 0.6,
                    mt: 0
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "4%" }}></TableCell>
                      <TableCell sx={{ width: "26%" }}>
                        <Typography sx={{ fontWeight: "600" }}>
                          Системийн хэрэглэгчийн бүлэг
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: "600" }}>
                          Албан тушаал
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: "4%" }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "error.light"
                        }
                      }}
                      selected={Boolean(
                        typeof namespacePositionFormik.errors
                          .namespacePositions === "string" &&
                          namespacePositionFormik.touched.namespacePositions
                      )}
                    >
                      <TableCell sx={{ width: "4%" }}>
                        <IconButton
                          sx={{ color: "primary.main" }}
                          onClick={() => {
                            if (
                              tempSelectedPosition.namespace &&
                              (tempSelectedPosition.position.length > 1 ||
                                tempSelectedPosition.position[0])
                            ) {
                              namespacePositionFormik.setValues(
                                (prevValues) => ({
                                  ...prevValues,
                                  namespacePositions: [
                                    ...prevValues.namespacePositions,
                                    {
                                      namespace: tempSelectedPosition.namespace,
                                      position:
                                        tempSelectedPosition.position.filter(
                                          (position) => position !== ""
                                        )
                                    }
                                  ]
                                })
                              );
                              setTempSelectedPosition({
                                namespace: "",
                                position: [""]
                              });
                              setDirtyConfig(true);
                            }
                          }}
                        >
                          <AddCircleTwoToneIcon
                            fontSize="medium"
                            sx={{
                              opacity:
                                tempSelectedPosition.namespace &&
                                (tempSelectedPosition.position.length > 1 ||
                                  tempSelectedPosition.position[0])
                                  ? 1
                                  : 0.5
                            }}
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        <Stack direction={"row"}>
                          <Autocomplete
                            id="namespace"
                            size="small"
                            options={namespaces
                              .filter((namespace) => {
                                return (
                                  namespace.userType.toLowerCase() ===
                                  values.userType?.toLowerCase()
                                );
                              })
                              .filter((namespace) => {
                                const namespaces =
                                  namespacePositionFormik.values.namespacePositions.map(
                                    (np) => np.namespace
                                  );
                                return !namespaces.includes(namespace.uuid);
                              })}
                            getOptionLabel={(option) => option.name || ""}
                            fullWidth
                            noOptionsText="Илэрц олдсонгүй."
                            clearText="Арилгах"
                            onChange={(
                              event: SyntheticEvent<Element, Event>,
                              selectedNamespace: NamespaceType | null
                            ) => {
                              setTempSelectedPosition({
                                namespace: selectedNamespace?.uuid || "",
                                position: tempSelectedPosition.position
                              });
                            }}
                            value={
                              namespaces.find((namespace) => {
                                return (
                                  namespace.uuid ===
                                  tempSelectedPosition.namespace
                                );
                              }) ||
                              ({
                                name: ""
                              } as NamespaceType)
                            }
                            renderInput={(params) => {
                              return <TextField {...params} name="namespace" />;
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "72%"
                        }}
                      >
                        <Stack direction={"row"} flexWrap={"wrap"}>
                          {tempSelectedPosition?.position.map(
                            (uuid, index: number) => {
                              const isLastElement =
                                tempSelectedPosition.position.length - 1 ===
                                index;
                              return (
                                <Box
                                  width={"33%"}
                                  display={"flex"}
                                  flexDirection={"row"}
                                  key={index}
                                >
                                  <Autocomplete
                                    id="position"
                                    size="small"
                                    sx={{ width: "100%" }}
                                    disableClearable={!isLastElement}
                                    noOptionsText="Илэрц олдсонгүй."
                                    options={positions
                                      .filter((position: PositionType) => {
                                        return (
                                          position?.userType?.toLowerCase() ===
                                          values.userType
                                        );
                                      })
                                      .filter((position: PositionType) => {
                                        return !tempSelectedPosition?.position.includes(
                                          position.uuid || ""
                                        );
                                      })}
                                    getOptionLabel={(option) =>
                                      option.name || ""
                                    }
                                    onChange={(
                                      event: SyntheticEvent<Element, Event>,
                                      selectedPosition: PositionType | null
                                    ) => {
                                      const updatedPosition =
                                        tempSelectedPosition.position.map(
                                          (position, i) => {
                                            if (i === index) {
                                              return (
                                                selectedPosition?.uuid || ""
                                              );
                                            }
                                            return position;
                                          }
                                        );
                                      setTempSelectedPosition(
                                        (prevSelectedPosition) => {
                                          return {
                                            ...prevSelectedPosition,
                                            position: updatedPosition
                                          };
                                        }
                                      );
                                    }}
                                    value={
                                      positions.find((position) => {
                                        return position.uuid === uuid;
                                      }) || null
                                    }
                                    renderInput={(params) => {
                                      return <TextField {...params} />;
                                    }}
                                    fullWidth
                                  />
                                  {isLastElement ? (
                                    <IconButton
                                      sx={{ color: "primary.main", mr: 4 }}
                                      onClick={() => {
                                        if (uuid)
                                          setTempSelectedPosition(
                                            (preValues) => {
                                              return {
                                                namespace: preValues.namespace,
                                                position: [
                                                  ...preValues.position,
                                                  ""
                                                ]
                                              };
                                            }
                                          );
                                      }}
                                    >
                                      <AddCircleTwoToneIcon
                                        fontSize="small"
                                        sx={{
                                          opacity: uuid ? 1 : 0.5
                                        }}
                                      />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      sx={{ mr: 4 }}
                                      onClick={() => {
                                        const updatedPosition =
                                          tempSelectedPosition.position.filter(
                                            (position) => position !== uuid
                                          );
                                        setTempSelectedPosition((preValues) => {
                                          return {
                                            namespace: preValues.namespace,
                                            position: updatedPosition
                                          };
                                        });
                                      }}
                                    >
                                      <HighlightOffTwoToneIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                              );
                            }
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ width: "4%" }}></TableCell>
                    </TableRow>
                    {namespacePositionFormik.values?.namespacePositions?.map(
                      (namespacePosition, index: number) => {
                        const currentNamespace = namespacePosition.namespace;
                        return (
                          <TableRow hover key={index}>
                            <TableCell sx={{ width: "4%" }}>
                              <Typography align="center">
                                {index + 1}.
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ width: "20%" }}>
                              <Autocomplete
                                disableClearable
                                id="namespace"
                                size="small"
                                options={namespaces
                                  .filter((namespace) => {
                                    return (
                                      namespace.userType.toLowerCase() ===
                                      values.userType
                                    );
                                  })
                                  .filter((namespace) => {
                                    return (
                                      !pickedNamespace.includes(
                                        namespace.uuid
                                      ) || currentNamespace === namespace.uuid
                                    );
                                  })}
                                getOptionLabel={(option) => option.name || ""}
                                value={namespaces.find((namespace) => {
                                  return namespace.uuid === currentNamespace;
                                })}
                                onChange={(
                                  event: SyntheticEvent<Element, Event>,
                                  selectedNamespace: NamespaceType | null
                                ) => {
                                  setDirtyConfig(true);
                                  namespacePositionFormik.setValues(
                                    (prevValues) => {
                                      return {
                                        ...prevValues,
                                        namespacePositions:
                                          prevValues.namespacePositions?.map(
                                            (item, i) => {
                                              if (i === index) {
                                                return {
                                                  namespace:
                                                    selectedNamespace?.uuid ||
                                                    "",
                                                  position: item.position
                                                };
                                              }
                                              return item;
                                            }
                                          )
                                      };
                                    }
                                  );
                                }}
                                sx={{ width: "100%" }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    name={`namespace.${index}.position`}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "72%"
                              }}
                            >
                              <Stack direction={"row"} flexWrap={"wrap"}>
                                {namespacePosition.position.map(
                                  (item, ix: number) => {
                                    const isLastElement =
                                      ix ===
                                      namespacePosition.position.length - 1;
                                    return (
                                      <Box
                                        width={"33%"}
                                        display={"flex"}
                                        flexDirection={"row"}
                                        key={ix}
                                      >
                                        <Autocomplete
                                          id="position"
                                          size="small"
                                          sx={{ width: "100%" }}
                                          disableClearable={!isLastElement}
                                          noOptionsText="Илэрц олдсонгүй."
                                          options={positions
                                            .filter(
                                              (position: PositionType) => {
                                                return (
                                                  position?.userType?.toLowerCase() ===
                                                  values.userType
                                                );
                                              }
                                            )
                                            .filter(
                                              (position: PositionType) => {
                                                return !namespacePosition.position.includes(
                                                  position.uuid || ""
                                                );
                                              }
                                            )}
                                          value={
                                            positions.find((position) => {
                                              return position.uuid === item;
                                            }) ||
                                            ({
                                              name: ""
                                            } as PositionType)
                                          }
                                          getOptionLabel={(option) =>
                                            option.name || ""
                                          }
                                          onChange={(
                                            event: SyntheticEvent<
                                              Element,
                                              Event
                                            >,
                                            selectedPosition: PositionType | null
                                          ) => {
                                            setDirtyConfig(true);
                                            namespacePositionFormik.setValues(
                                              (prevValues) => {
                                                return {
                                                  ...prevValues,
                                                  namespacePositions:
                                                    prevValues.namespacePositions?.map(
                                                      (
                                                        namespacePosition,
                                                        i
                                                      ) => {
                                                        if (i !== index)
                                                          return namespacePosition;
                                                        return {
                                                          namespace:
                                                            namespacePosition.namespace,
                                                          position:
                                                            namespacePosition.position.map(
                                                              (position, j) => {
                                                                if (j === ix) {
                                                                  return (
                                                                    selectedPosition?.uuid ||
                                                                    ""
                                                                  );
                                                                }
                                                                return position;
                                                              }
                                                            )
                                                        };
                                                      }
                                                    )
                                                };
                                              }
                                            );
                                          }}
                                          fullWidth
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              name={`namespacePositions[${index}].position[${ix}]`}
                                              helperText={
                                                Boolean(
                                                  namespacePositionFormik.errors
                                                    ?.namespacePositions?.[
                                                    index
                                                  ]?.position
                                                ) &&
                                                namespacePositionFormik.touched
                                                  .namespacePositions
                                                  ? namespacePositionFormik
                                                      .errors
                                                      ?.namespacePositions?.[
                                                      index
                                                    ]?.position
                                                  : ""
                                              }
                                              error={
                                                Boolean(
                                                  namespacePositionFormik.errors
                                                    ?.namespacePositions?.[
                                                    index
                                                  ]?.position
                                                ) &&
                                                Boolean(
                                                  namespacePositionFormik
                                                    .touched.namespacePositions
                                                )
                                              }
                                              variant="outlined"
                                            />
                                          )}
                                        />
                                        {isLastElement ? (
                                          <IconButton
                                            sx={{
                                              color: "primary.main",
                                              mr: 4
                                            }}
                                            onClick={() => {
                                              if (item) {
                                                namespacePositionFormik.setValues(
                                                  (prevValues) => {
                                                    return {
                                                      ...prevValues,
                                                      namespacePositions:
                                                        prevValues.namespacePositions.map(
                                                          (
                                                            namespacePosition,
                                                            i
                                                          ) => {
                                                            if (index === i) {
                                                              return {
                                                                namespace:
                                                                  namespacePosition.namespace,
                                                                position: [
                                                                  ...namespacePosition.position,
                                                                  ""
                                                                ]
                                                              };
                                                            }
                                                            return namespacePosition;
                                                          }
                                                        )
                                                    };
                                                  }
                                                );
                                                setDirtyConfig(true);
                                              }
                                            }}
                                          >
                                            <AddCircleTwoToneIcon
                                              fontSize="small"
                                              sx={{
                                                opacity: item ? 1 : 0.5
                                              }}
                                            />
                                          </IconButton>
                                        ) : (
                                          <IconButton
                                            sx={{ mr: 4 }}
                                            onClick={() => {
                                              setDirtyConfig(true);
                                              namespacePositionFormik.setValues(
                                                (prevValues) => {
                                                  return {
                                                    ...prevValues,
                                                    namespacePositions:
                                                      prevValues.namespacePositions?.map(
                                                        (
                                                          namespacePosition,
                                                          i
                                                        ) => {
                                                          if (index === i)
                                                            return {
                                                              namespace:
                                                                namespacePosition.namespace,
                                                              position:
                                                                namespacePosition.position.filter(
                                                                  (
                                                                    position,
                                                                    j
                                                                  ) => j != ix
                                                                )
                                                            };
                                                          return namespacePosition;
                                                        }
                                                      )
                                                  };
                                                }
                                              );
                                            }}
                                          >
                                            <HighlightOffTwoToneIcon fontSize="small" />
                                          </IconButton>
                                        )}
                                      </Box>
                                    );
                                  }
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell sx={{ width: "4%" }}>
                              <IconButton
                                sx={{ color: "error.main" }}
                                onClick={() => {
                                  namespacePositionFormik.setValues(
                                    (prevValues) => ({
                                      ...prevValues,
                                      namespacePositions:
                                        prevValues.namespacePositions?.filter(
                                          (item, i) => i !== index
                                        )
                                    })
                                  );
                                  setDirtyConfig(true);
                                }}
                              >
                                <RemoveCircleOutlineTwoToneIcon fontSize="medium" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={11.5}>
                <Stack
                  direction="row"
                  justifyContent={"flex-end"}
                  spacing={2}
                  mt={2.5}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={() => {
                      namespacePositionFormik.handleSubmit();
                    }}
                    disabled={!dirtyConfig}
                  >
                    Хадгалах
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default EditUser;
