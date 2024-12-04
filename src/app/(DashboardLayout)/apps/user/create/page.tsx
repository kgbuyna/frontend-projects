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
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { postRequest } from "@/utils/network/handlers";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import RemoveCircleOutlineTwoToneIcon from "@mui/icons-material/RemoveCircleOutlineTwoTone";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  phone: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  status: Yup.string().required(),
  lastName: Yup.string().required(),
  firstName: Yup.string().required(),
  password: Yup.string().required(),
  userType: Yup.string().required(),
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
    .min(1, "Энэ талбарыг бөглөх шаардлагатай."),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Нууц үг тохирохгүй байна.")
});
const GET_CHOICES = gql`
  query F {
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

const initialValues: UserType = {
  pk: "",
  name: "",
  status: "ok",
  phone: "",
  username: "",
  email: "",
  lastName: "",
  firstName: "",
  userType: "",
  password: "",
  confirmPassword: "",
  namespacePositions: []
};
const CreateUser = () => {
  const router = useRouter();
  const { data } = useQuery(GET_CHOICES);
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  const borderColor = theme.palette.divider;
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
        },
        configs: {
          namespace_position: [] as { namespace: string; position: string }[]
        }
      };
      values?.namespacePositions?.forEach((namespacePosition) => {
        namespacePosition.position.forEach((position) => {
          if (position)
            body.configs.namespace_position.push({
              namespace: namespacePosition.namespace,
              position: position
            });
        });
      });
      try {
        const res = await postRequest("/user/insert/", body);
        if (res.status_code === "ok") {
          toast.success("Амжилттай бүртгэгдлээ.", {
            position: "top-right",
            duration: 3000
          });
          router.back();
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
  const { values, handleChange, setValues, touched, errors } = formik;
  const namespaces: NamespaceType[] =
    data?.namespaces?.edges.map((edge: { node: NamespaceType }) => edge.node) ??
    [];
  const positions: PositionType[] =
    data?.positions?.edges.map((edge: { node: PositionType }) => edge.node) ??
    [];
  const label = 4;
  const form = 7;
  const [selectedPosition, setSelectedPosition] = useState<
    Record<string, string[]>
  >({});
  const [tempSelectedPosition, setTempSelectedPosition] = useState<{
    namespace: string;
    position: string[];
  }>({ namespace: "", position: [""] });

  const pickedNamespace =
    values.namespacePositions?.map(
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
        <Typography variant="h5">Хэрэглэгчийн мэдээлэл бүртгэх</Typography>
      </Stack>

      {/* */}

      <Divider />
      <CardContent>
        <Grid container xs={12}>
          <CardContent sx={{ mt: -0.5, pb: 0 }}>
            <Typography variant="h6" mb={3}>
              Хэрэглэгчийн мэдээлэл
            </Typography>
            <Grid container xs={11.5} rowSpacing={2}>
              {/* column1 */}
              <Grid item lg={6} md={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={label}>
                    <CustomFormLabel sx={{ mt: 2 }}>Төлөв</CustomFormLabel>
                  </Grid>
                  <Grid item xs={12} sm={form}>
                    <Select
                      id="status"
                      variant="outlined"
                      name="status"
                      value={values.status}
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
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={label}>
                    <CustomFormLabel
                      sx={{
                        mt: 2
                      }}
                    >
                      Овог
                    </CustomFormLabel>
                  </Grid>
                  <Grid item xs={12} sm={form}>
                    <CustomTextFieldForm
                      id="lastName"
                      variant="outlined"
                      name="lastName"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      value={values.lastName}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={label}>
                    <CustomFormLabel sx={{ mt: 2 }}>Нэр</CustomFormLabel>
                  </Grid>
                  <Grid item xs={12} sm={form}>
                    <CustomTextFieldForm
                      id="firstName"
                      variant="outlined"
                      name="firstName"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      value={values.firstName}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={label}>
                    <CustomFormLabel sx={{ mt: 2 }}>Имэйл хаяг</CustomFormLabel>
                  </Grid>
                  <Grid item xs={12} sm={form}>
                    <CustomTextFieldForm
                      id="email"
                      variant="outlined"
                      name="email"
                      value={values.email}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={label}>
                    <CustomFormLabel sx={{ mt: 2 }}>Утас</CustomFormLabel>
                  </Grid>
                  <Grid item xs={12} sm={form}>
                    <CustomTextFieldForm
                      id="phone"
                      variant="outlined"
                      name="phone"
                      type="number"
                      value={values.phone}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                lg={0}
                md={0}
                sx={{
                  [theme.breakpoints.up("md")]: {
                    display: "none"
                  }
                }}
              >
                <Divider sx={{ mt: 1, mb: 1 }} />
              </Grid>
              {/* column2 */}
              <Grid item lg={6} md={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={label}>
                    <CustomFormLabel sx={{ mt: 0 }}>
                      Нэвтрэх нэр
                    </CustomFormLabel>
                  </Grid>
                  <Grid item xs={12} sm={form}>
                    <CustomTextFieldForm
                      id="username"
                      variant="outlined"
                      name="username"
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      value={values.username}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={label}>
                    <CustomFormLabel sx={{ mt: 0 }}>Нууц үг</CustomFormLabel>
                  </Grid>
                  <Grid item xs={12} sm={form}>
                    <CustomTextFieldForm
                      id="password"
                      variant="outlined"
                      name="password"
                      type="password"
                      value={values.password}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={label}>
                    <CustomFormLabel sx={{ mt: 0 }}>
                      Нууц үг давтан оруулах
                    </CustomFormLabel>
                  </Grid>
                  <Grid item xs={12} sm={form}>
                    <CustomTextFieldForm
                      id="confirmPassword"
                      variant="outlined"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      error={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
                      }
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
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
              <Grid item xs={12}>
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
                        error={touched.userType && Boolean(errors.userType)}
                        onChange={(event: SelectChangeEvent<unknown>) => {
                          setTempSelectedPosition({
                            namespace: "",
                            position: [""]
                          });
                          setValues((prevValues) => ({
                            ...prevValues,
                            namespacePositions: []
                          }));
                          handleChange(event);
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
                          typeof errors.namespacePositions === "string" &&
                            touched.namespacePositions
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
                                setValues((prevValues) => ({
                                  ...prevValues,
                                  namespacePositions: [
                                    ...(prevValues.namespacePositions || []),
                                    {
                                      namespace: tempSelectedPosition.namespace,
                                      position:
                                        tempSelectedPosition.position.filter(
                                          (position) => position !== ""
                                        )
                                    }
                                  ]
                                }));
                                setTempSelectedPosition({
                                  namespace: "",
                                  position: [""]
                                });
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
                                    values.userType
                                  );
                                })
                                .filter((namespace) => {
                                  const namespaces =
                                    values?.namespacePositions?.map(
                                      (np) => np.namespace
                                    );
                                  return !namespaces?.includes(namespace.uuid);
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
                                return (
                                  <TextField {...params} name="namespace" />
                                );
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
                                        return (
                                          <TextField
                                            {...params}
                                            // error={Boolean(
                                            //   errors.namespace && touched.namespace
                                            // )}
                                          />
                                        );
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
                                                  namespace:
                                                    preValues.namespace,
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
                                          setTempSelectedPosition(
                                            (preValues) => {
                                              return {
                                                namespace: preValues.namespace,
                                                position: updatedPosition
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

                        <TableCell sx={{ width: "4%" }}></TableCell>
                      </TableRow>
                      {values?.namespacePositions?.map(
                        (namespacePosition, index: number) => {
                          const currentNamespace = namespacePosition.namespace;
                          return (
                            <TableRow hover>
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
                                    setValues((prevValues) => {
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
                                    });
                                  }}
                                  sx={{ width: "100%" }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name={`namespacePositions.${index}.namespace`}
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
                                    (item, i: number) => {
                                      const isLastElement =
                                        i ===
                                        namespacePosition.position.length - 1;
                                      return (
                                        <Box
                                          width={"33%"}
                                          display={"flex"}
                                          flexDirection={"row"}
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
                                              setValues((prevValues) => {
                                                return {
                                                  ...prevValues,
                                                  namespacePositions:
                                                    prevValues.namespacePositions?.map(
                                                      (item, ix) => {
                                                        if (ix === index) {
                                                          return {
                                                            namespace:
                                                              item.namespace,
                                                            position:
                                                              item.position.map(
                                                                (
                                                                  position,
                                                                  j
                                                                ) => {
                                                                  if (j === i) {
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
                                                        return item;
                                                      }
                                                    )
                                                };
                                              });
                                            }}
                                            fullWidth
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                name={`namespacePositions[${index}].position[${i}]`}
                                                helperText={
                                                  Boolean(
                                                    errors
                                                      ?.namespacePositions?.[
                                                      index
                                                    ]?.position
                                                  ) &&
                                                  touched.namespacePositions
                                                    ? errors
                                                        ?.namespacePositions?.[
                                                        index
                                                      ]?.position
                                                    : ""
                                                }
                                                error={
                                                  Boolean(
                                                    errors
                                                      ?.namespacePositions?.[
                                                      index
                                                    ]?.position
                                                  ) &&
                                                  touched.namespacePositions
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
                                                if (item)
                                                  setValues((prevValues) => {
                                                    return {
                                                      ...prevValues,
                                                      namespacePositions:
                                                        prevValues.namespacePositions?.map(
                                                          (item, i) => {
                                                            if (i === index) {
                                                              return {
                                                                namespace:
                                                                  item.namespace,
                                                                position: [
                                                                  ...item.position,
                                                                  ""
                                                                ]
                                                              };
                                                            }
                                                            return item;
                                                          }
                                                        )
                                                    };
                                                  });
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
                                                const updatedPosition =
                                                  namespacePosition.position.filter(
                                                    (position, ix) => ix !== i
                                                  );
                                                setValues((prevValues) => {
                                                  return {
                                                    ...prevValues,
                                                    namespacePositions:
                                                      prevValues.namespacePositions?.map(
                                                        (item, ix) => {
                                                          if (ix === index) {
                                                            return {
                                                              namespace:
                                                                item.namespace,
                                                              position:
                                                                updatedPosition
                                                            };
                                                          }
                                                          return item;
                                                        }
                                                      )
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

                              <TableCell sx={{ width: "4%" }}>
                                <IconButton
                                  sx={{ color: "error.main" }}
                                  onClick={() => {
                                    setValues((prevValues) => ({
                                      ...prevValues,
                                      namespacePositions:
                                        prevValues.namespacePositions?.filter(
                                          (item, i) => i !== index
                                        )
                                    }));
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
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                  >
                    Хадгалах
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Болих
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
export default CreateUser;
