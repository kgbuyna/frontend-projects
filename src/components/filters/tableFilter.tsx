import React, { ChangeEvent } from "react";

import { FieldArray, Formik, Form, Field } from "formik";
import * as yup from "yup";

import {
  Typography,
  Popover,
  MenuItem,
  Grid,
  Button,
  Box,
  Stack,
  TextField,
  IconButton
} from "@mui/material";

import { IconPlus, IconTrash } from "@tabler/icons-react";

import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { TableListFieldType } from "@/app/(DashboardLayout)/types/tms/common";

type FilterProps = {
  open: boolean;
  anchorEl: HTMLButtonElement | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  fields: TableListFieldType[];
};

export type Filter = {
  field: string;
  value: string;
  empty: string[];
  op: string;
};

const filterOptions: {
  text: { key: string; label: string }[];
  number: { key: string; label: string }[];
  date: { key: string; label: string }[];
  boolean: { key: string; label: string }[];
} = {
  text: [
    { key: "eq", label: "Equal" },
    { key: "ne", label: "Not Equal" },
    { key: "like", label: "Like" },
    { key: "not_like", label: "Not Like" },
    { key: "in", label: "In" },
    { key: "not_in", label: "Not In" }
  ],
  number: [
    { key: "eq", label: "Equal" },
    { key: "ne", label: "Not Equal" },
    { key: "gt", label: "Greater Than" },
    { key: "lt", label: "Less Than" },
    { key: "gte", label: "Greater Than or Equal" },
    { key: "lte", label: "Less Than or Equal" },
    { key: "in", label: "In" },
    { key: "not_in", label: "Not In" }
  ],
  date: [
    { key: "eq", label: "Equal" },
    { key: "ne", label: "Not Equal" },
    { key: "gt", label: "Greater Than" },
    { key: "lt", label: "Less Than" },
    { key: "gte", label: "Greater Than or Equal" },
    { key: "lte", label: "Less Than or Equal" }
  ],
  boolean: [
    { key: "eq", label: "Equal" },
    { key: "ne", label: "Not Equal" }
  ]
};
const TableFilter = ({
  open,
  anchorEl,
  setOpen,
  fields,
  filters,
  setFilters
}: FilterProps) => {
  const handleClose = () => {
    setOpen(false);
  };
  const validationSchema = yup.object().shape({
    filters: yup.array().of(
      yup.object().shape({
        field: yup.string().required("Field is required"),
        value: yup.string().required("Value is required"),
        op: yup.string().required("Op is required"),
        empty: yup.array().of(yup.string())
      })
    )
  });
  const initialValues: { filters: Filter[] } = {
    filters: filters
  };
  return (
    <Popover
      id="filter-menu"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
    >
      <Box padding={2}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={() => {}}
        >
          {({ resetForm, handleChange, validateForm, values }) => {
            return (
              <Form>
                <FieldArray name="filters">
                  {({ form, push, remove }) => {
                    return (
                      <Box>
                        {form.values.filters.map(
                          (filter: Filter, index: number) => {
                            const typeField =
                              fields.find((field) => field.key === filter.field)
                                ?.type || "text";

                            return (
                              <Box key={index}>
                                <Grid container columnSpacing={1}>
                                  <Grid item lg={5} md={5} sm={5}>
                                    <Field
                                      placeholder="Column name"
                                      render={() => (
                                        <CustomSelect
                                          error={filter.empty.includes("field")}
                                          labelId="Column name"
                                          placeholder="Column name"
                                          name={`filters.${index}.field`}
                                          value={filter.field}
                                          onChange={(event: ChangeEvent) => {
                                            filter.empty = [];
                                            handleChange(event);
                                          }}
                                          fullWidth
                                        >
                                          {fields.map((field, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={field.key}
                                              >
                                                {field.label}
                                              </MenuItem>
                                            );
                                          })}
                                        </CustomSelect>
                                      )}
                                    />
                                  </Grid>
                                  <Grid item lg={3} md={3} sm={3}>
                                    <Field
                                      render={() => (
                                        <CustomSelect
                                          error={filter.empty.includes("op")}
                                          labelId="Operations"
                                          value={filter.op}
                                          name={`filters.${index}.op`}
                                          onChange={(event: ChangeEvent) => {
                                            filter.empty = [];
                                            handleChange(event);
                                          }}
                                          fullWidth
                                        >
                                          {filterOptions[
                                            fields.find(
                                              (field) =>
                                                field.key === filter.field
                                            )
                                              ?.type as keyof typeof filterOptions
                                          ]?.map((option, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={option.key}
                                              >
                                                {option.label}
                                              </MenuItem>
                                            );
                                          })}
                                        </CustomSelect>
                                      )}
                                    />
                                  </Grid>
                                  <Grid item lg={3} md={3} sm={3}>
                                    <Field
                                      render={() => (
                                        <TextField
                                          error={filter.empty.includes("value")}
                                          id="Value"
                                          variant="outlined"
                                          type={typeField}
                                          fullWidth
                                          sx={{ mb: 3 }}
                                          value={filter.value}
                                          name={`filters.${index}.value`}
                                          onChange={(event: ChangeEvent) => {
                                            filter.empty = [];
                                            handleChange(event);
                                          }}
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item lg={1} md={1} sm={1}>
                                    {index > 0 ? (
                                      <IconButton
                                        onClick={() => {
                                          remove(index);
                                        }}
                                      >
                                        <IconTrash width={24}></IconTrash>
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        onClick={() =>
                                          push({
                                            field: "",
                                            value: "",
                                            op: "",
                                            empty: []
                                          })
                                        }
                                      >
                                        <IconPlus width={24}></IconPlus>
                                      </IconButton>
                                    )}
                                  </Grid>
                                </Grid>
                              </Box>
                            );
                          }
                        )}
                      </Box>
                    );
                  }}
                </FieldArray>
                <Stack gap={1} direction="row">
                  <Button
                    type="submit"
                    onClick={async () => {
                      let valid = 1;
                      try {
                        const validatedForm = await validateForm(values);
                        if (Array.isArray(validatedForm.filters)) {
                          validatedForm.filters?.forEach((filter, index) => {
                            values.filters[index].empty = []; // Explicitly define the type of 'empty' as an array of strings
                            if (filter) {
                              valid = 0;
                              Object.keys(filter).forEach((key) => {
                                values.filters[index].empty.push(key);
                              });
                            }
                          });
                        }
                        if (valid) {
                          console.log("Form is valid");
                        }
                        console.log(values);
                        setFilters(values.filters);
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <Typography>Хайх</Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      resetForm();
                    }}
                  >
                    <Typography>Цэвэрлэх</Typography>
                  </Button>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Popover>
  );
};

export default TableFilter;
