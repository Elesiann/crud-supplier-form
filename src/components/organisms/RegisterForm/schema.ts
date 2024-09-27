import * as yup from "yup";

export const supplierFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  contacts: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Contact name is required"),
        phone: yup.string().required("Phone number is required")
      })
    )
    .min(1, "At least one contact is required"),
  address: yup.object().shape({
    zipCode: yup.string().required("ZIP code is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    street: yup.string().required("Street is required"),
    number: yup.number().typeError("Number must be a number").required("Number is required"),
    reference: yup.string().optional()
  })
});
