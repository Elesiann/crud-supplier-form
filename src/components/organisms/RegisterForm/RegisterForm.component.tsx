import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputBase, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import styled from "styled-components";
import ViaCep from "../../../api/Viacep";
import { ISupplier } from "../../../types/Supplier.type";
import { handleNotification } from "../../../utils/notification";
import { supplierFormSchema } from "./schema";

interface RegisterFormProps {
  onFormSubmit: (data: ISupplier) => void;
  defaultValues?: ISupplier;
}

export default function RegisterForm(props: RegisterFormProps) {
  const [disabledFields, setDisabledFields] = useState({
    city: true,
    state: true,
    street: true,
    number: true
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors, dirtyFields }
  } = useForm<ISupplier>({
    resolver: yupResolver(supplierFormSchema) as any,
    defaultValues: props.defaultValues || {
      contacts: [{ name: "", phone: "" }],
      address: { zipCode: "", state: "", city: "", street: "", number: undefined, reference: "" }
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

  const onSubmit = async (data: ISupplier) => {
    props.onFormSubmit(data);
  };

  const zipCode = watch("address.zipCode");

  const fetchAddress = async (zipCode: string) => {
    const handleSetFieldValue = (
      fieldName: string,
      value: string | undefined,
      setDisabled: React.Dispatch<React.SetStateAction<typeof disabledFields>>
    ) => {
      setValue(fieldName as keyof ISupplier, value || "");
      setDisabled((prev) => ({ ...prev, [fieldName.split(".")[1]]: !!value }));
    };

    const handleSetError = (fieldName: string, message: string) => {
      setError(fieldName as keyof ISupplier, { message });
    };

    try {
      const data = await ViaCep.getZipCode(zipCode);

      if (!data.erro) {
        const { localidade, uf, logradouro } = data;

        handleSetFieldValue("address.city", localidade, setDisabledFields);
        handleSetFieldValue("address.state", uf, setDisabledFields);
        handleSetFieldValue("address.street", logradouro, setDisabledFields);

        setDisabledFields((prev) => ({ ...prev, number: !dirtyFields?.address?.zipCode }));

        handleSetError("address.zipCode", "");

        handleNotification("Address data fetched", "Address data fetched successfully", "green");

        return;
      }

      handleSetError("address.zipCode", "Invalid ZIP code");
      handleNotification(
        "Invalid ZIP code",
        "Failed to fetch address data. Please check the ZIP code",
        "red"
      );
    } catch (error) {
      handleNotification("Address data fetch failed", "Failed to fetch address data.", "red");
    }
  };

  useEffect(() => {
    if (zipCode.length === 8 && dirtyFields.address?.zipCode) {
      fetchAddress(zipCode);
    }
  }, [zipCode]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextInput
          mb={8}
          label="Name"
          placeholder="Enter supplier's name"
          {...register("name")}
          error={errors.name?.message}
        />
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
              defaultValue={item.phone}
              onChange={(e) => {
                const value = e.currentTarget.value.replace(/[^0-9]/g, "");
                setValue(`contacts.${index}.phone`, value);
              }}
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
        <Button
          leftSection={<PlusCircle size={18} />}
          mt={24}
          onClick={() => appendContact({ name: "", phone: "" })}
        >
          Add another contact
        </Button>
      </div>

      <div>
        <h2>Address</h2>
        <div>
          <SimpleGrid cols={3} mb={8}>
            <InputBase
              component={IMaskInput}
              mask="00000-000"
              label="ZIP Code"
              placeholder="Enter ZIP code"
              {...register(`address.zipCode` as const)}
              defaultValue={props.defaultValues?.address.zipCode}
              onChange={(e) => {
                const value = e.currentTarget.value.replace(/[^0-9]/g, "");
                setValue(`address.zipCode`, value, {
                  shouldDirty: true
                });
              }}
              error={errors.address?.zipCode?.message}
            />

            <TextInput
              disabled={disabledFields.state}
              label="State"
              placeholder="Enter state"
              {...register(`address.state` as const)}
              error={errors.address?.state?.message}
            />

            <TextInput
              disabled={disabledFields.city}
              label="City"
              placeholder="Enter city"
              {...register(`address.city` as const)}
              error={errors.address?.city?.message}
            />
          </SimpleGrid>

          <SimpleGrid cols={2} mb={8}>
            <TextInput
              disabled={disabledFields.street}
              label="Street"
              placeholder="Enter street"
              {...register(`address.street` as const)}
              error={errors.address?.street?.message}
            />

            <TextInput
              disabled={disabledFields.number}
              label="Number"
              placeholder="Enter number"
              {...register(`address.number`, { valueAsNumber: true } as const)}
              error={errors.address?.number?.message}
            />
          </SimpleGrid>

          <TextInput
            label="Landmark"
            placeholder="Enter landmark (optional)"
            {...register(`address.reference` as const)}
          />
        </div>
      </div>

      <Button className="submit_button" h={48} mt={24} w={"100%"} type="submit">
        {props.defaultValues ? "Update supplier" : "Register supplier"}
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
