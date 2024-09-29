import { ISupplier } from "../types/Supplier.type";

interface HandleCsvExportProps {
  selectedRows: ISupplier[];
  rows: ISupplier[];
}

export default function handle_csv_export(props: HandleCsvExportProps) {
  const payloadToExport = props.selectedRows.length > 0 ? props.selectedRows : props.rows;

  return {
    fields: ["name", "description", "contacts", "address"],
    data: payloadToExport?.map((row) => {
      const { name, description, contacts, address } = row;
      const { street, number, city, state } = address;

      return {
        name,
        description,
        contacts: contacts.map((contact) => `${contact.name} - ${contact.phone}`).join(", "),
        address: `${street}, ${number}, ${city}, ${state}`
      };
    })
  };
}
