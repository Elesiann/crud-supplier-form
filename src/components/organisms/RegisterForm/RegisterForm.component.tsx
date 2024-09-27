import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputBase, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { PlusCircle, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import styled from "styled-components";
import * as yup from "yup";

type Contact = { name: string; phone: string };
type Address = {
  zipCode: string;
  state: string;
  city: string;
  street: string;
  number: number;
  reference?: string;
};

type FormData = {
  name: string;
  description: string;
  contacts: Contact[];
  address: Address[];
};

const schema = yup.object().shape({
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
  address: yup.array().of(
    yup.object().shape({
      zipCode: yup.string().required("ZIP code is required"),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      street: yup.string().required("Street is required"),
      number: yup.number().typeError("Number must be a number").required("Number is required"),
      reference: yup.string().optional()
    })
  )
});

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      contacts: [{ name: "", phone: "" }],
      address: [{ zipCode: "", state: "", city: "", street: "", number: undefined, reference: "" }]
    }
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact
  } = useFieldArray({
    control,
    name: "contacts"
  });

  const { fields: addressFields } = useFieldArray({
    control,
    name: "address"
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextInput mb={8} label="Name" placeholder="Enter supplier's name" {...register("name")} error={errors.name?.message} />
      </div>

      <div>
        <Textarea
          label="Description"
          placeholder="Short description about supplier"
          {...register("description")}
          error={errors.description?.message}
        />
      </div>

      <div>
        <h2>Contact</h2>
        {contactFields.map((item, index) => (
          <ContactGrid key={item.id}>
            <TextInput
              label="Name"
              placeholder="Enter contact's name"
              {...register(`contacts.${index}.name` as const)}
              error={errors.contacts?.[index]?.name?.message}
            />
            <InputBase
              component={IMaskInput}
              mask="(00) 00000-0000"
              label="Phone"
              placeholder="Enter contact's phone number"
              {...register(`contacts.${index}.phone` as const)}
              error={errors.contacts?.[index]?.phone?.message}
            />
            <Button
              disabled={contactFields.length === 1}
              variant="outline"
              color="red"
              mb={errors.contacts?.[index] && 19}
              onClick={() => contactFields.length > 1 && removeContact(index)}
            >
              <X />
            </Button>
          </ContactGrid>
        ))}
        <Button leftSection={<PlusCircle size={18} />} mt={24} onClick={() => appendContact({ name: "", phone: "" })}>
          Add another contact
        </Button>
      </div>

      <div>
        <h2>Address</h2>
        {addressFields.map((item, index) => (
          <div key={item.id}>
            <SimpleGrid cols={3} mb={8}>
              <InputBase
                component={IMaskInput}
                mask="00000-000"
                label="ZIP Code"
                placeholder="Enter ZIP code"
                {...register(`address.${index}.zipCode` as const)}
                error={errors.address?.[index]?.zipCode?.message}
              />

              <TextInput
                label="State"
                placeholder="Enter state"
                {...register(`address.${index}.state` as const)}
                error={errors.address?.[index]?.state?.message}
              />
              <TextInput
                label="City"
                placeholder="Enter city"
                {...register(`address.${index}.city` as const)}
                error={errors.address?.[index]?.city?.message}
              />
            </SimpleGrid>

            <SimpleGrid cols={2} mb={8}>
              <TextInput
                label="Street"
                placeholder="Enter street"
                {...register(`address.${index}.street` as const)}
                error={errors.address?.[index]?.street?.message}
              />

              <TextInput
                label="Number"
                placeholder="Enter number"
                {...register(`address.${index}.number`, { valueAsNumber: true } as const)}
                error={errors.address?.[index]?.number?.message}
              />
            </SimpleGrid>
            <TextInput label="Landmark" placeholder="Enter landmark (optional)" {...register(`address.${index}.reference` as const)} />
          </div>
        ))}
      </div>

      <Button className="submit_button" h={48} mt={24} w={"100%"} type="submit">
        Submit
      </Button>
    </Form>
  );
}

const Form = styled.form`
  padding: 1rem 1rem 3rem 1rem;

  .submit_button {
    font-size: 1rem;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 1fr;
  align-items: end;
  gap: 0.5rem;
`;
