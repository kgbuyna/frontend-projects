import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

const getHelperText = (helperText: string): string => {
  if (!helperText) return "";

  if (helperText.includes("required")) {
    return "Энэ талбарыг бөглөх шаардлагатай.";
  }
  if (helperText.includes("exactly")) {
    return "Тохирох утга оруулна уу.";
  }
  if (helperText.includes("email")) {
    return "Зөв имэйл хаяг оруулна уу. Жишээ нь: example@example.com";
  }

  if (helperText.includes("match")) {
    return "Формат буруу байна.";
  }

  const extractCharacters = (
    pattern: RegExp,
    text: string,
    message: string
  ) => {
    const match = text.match(pattern);
    return match ? `${message} ${match[1]} тэмдэгт оруулна уу.` : "";
  };

  if (helperText.includes("least")) {
    return extractCharacters(
      /at least (\d+) characters/,
      helperText,
      "Хамгийн багадаа"
    );
  }

  if (helperText.includes("most")) {
    return extractCharacters(
      /at most (\d+) characters/,
      helperText,
      "Хамгийн ихдээ"
    );
  }

  return helperText;
};
const CustomTextFieldForm = (props: TextFieldProps) => {
  const helperText = props.error
    ? getHelperText(String(props?.helperText) ?? "")
    : "";
  return (
    <>
      <TextField {...props} helperText={helperText}>
        {props.children}
      </TextField>
    </>
  );
};

export default CustomTextFieldForm;
