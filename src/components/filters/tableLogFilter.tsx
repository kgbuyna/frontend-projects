import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Typography,
  TextField
} from "@mui/material";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Field, FieldArray, Form, Formik } from "formik";
import { ChangeEvent, MouseEvent } from "react";
import * as yup from "yup";
import { TableListFieldType } from "@/app/(DashboardLayout)/types/tms/common";

interface Filter {
  field: string;
  value: string;
  empty: string[];
  op?: string;
}

interface FilterProps {
  open: boolean;
  anchorEl: HTMLElement | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  fields: TableListFieldType[];
}

const filterOptions: {
  text: { key: string; label: string }[];
  "datetime-local": { key: string; label: string }[];
} = {
  text: [{ key: "like", label: "Like" }],
  "datetime-local": [
    { key: "Date From", label: "Time From" },
    { key: "Date To", label: "Time To" }
  ]
};

const TableLogFilter = ({
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
        // op: yup.string().required("Op is required"),
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
          {({ resetForm, handleChange, validateForm, values, setValues }) => {
            return (
              <Form>
                <FieldArray name="filters">
                  {({ form, push, remove }) => {
                    return (
                      <Box>
                        {form.values.filters.map(
                          (filter: Filter, index: number) => {
                            const field = fields?.find(
                              (field) => field.key === filter.field
                            );
                            const fieldType = field?.type || "text";
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
                                    {fieldType !== "datetime-local" ? (
                                      <Field
                                        render={() => (
                                          <CustomSelect
                                            disabled={true}
                                            value={"like"}
                                            fullWidth
                                          >
                                            <MenuItem value="like">
                                              Like
                                            </MenuItem>
                                          </CustomSelect>
                                        )}
                                      />
                                    ) : (
                                      <Field
                                        render={() => (
                                          <CustomSelect
                                            value={filter.op}
                                            error={filter.empty.includes("op")}
                                            labelId="Operations"
                                            name={`filters.${index}.op`}
                                            onChange={(event: ChangeEvent) => {
                                              filter.empty = [];
                                              handleChange(event);
                                            }}
                                            fullWidth
                                          >
                                            {filterOptions[fieldType]?.map(
                                              (option, index) => {
                                                return (
                                                  <MenuItem
                                                    key={index}
                                                    value={option.key}
                                                  >
                                                    {option.label}
                                                  </MenuItem>
                                                );
                                              }
                                            )}
                                          </CustomSelect>
                                        )}
                                      />
                                    )}
                                  </Grid>
                                  <Grid item lg={3} md={3} sm={3}>
                                    <Field
                                      render={() => {
                                        if (fieldType !== "choice") {
                                          return (
                                            <TextField
                                              error={filter.empty.includes(
                                                "value"
                                              )}
                                              id="Value"
                                              variant="outlined"
                                              type={fieldType}
                                              fullWidth
                                              sx={{ mb: 3 }}
                                              value={filter.value}
                                              name={`filters.${index}.value`}
                                              onChange={(
                                                event: ChangeEvent
                                              ) => {
                                                filter.empty = [];
                                                handleChange(event);
                                              }}
                                            />
                                          );
                                        }
                                        return (
                                          <CustomSelect
                                            error={filter.empty.includes(
                                              "value"
                                            )}
                                            labelId="Value"
                                            placeholder="Value"
                                            name={`filters.${index}.value`}
                                            value={filter.value}
                                            sx={{ mb: 3 }}
                                            onChange={(event: ChangeEvent) => {
                                              filter.empty = [];
                                              handleChange(event);
                                            }}
                                            fullWidth
                                          >
                                            {field?.choices?.map(
                                              (choice, index) => {
                                                return (
                                                  <MenuItem
                                                    key={index}
                                                    value={choice.value}
                                                  >
                                                    {choice.label}
                                                  </MenuItem>
                                                );
                                              }
                                            )}
                                          </CustomSelect>
                                        );
                                      }}
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
                                            // op: "like",
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
                          setFilters(values.filters);
                        }
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

                      setFilters([
                        {
                          field: "",
                          value: "",
                          op: "",
                          empty: []
                        }
                      ]);
                      setValues({
                        filters: [
                          {
                            field: "",
                            value: "",
                            op: "",
                            empty: []
                          }
                        ]
                      });
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

export default TableLogFilter;
