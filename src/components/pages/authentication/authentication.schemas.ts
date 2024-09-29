import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
});

export const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email format").required(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
});
