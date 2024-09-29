import { ActionIcon, Menu } from "@mantine/core";
import { CircleEllipsis, MapPin, PencilLine, PhoneOutgoing, Trash } from "lucide-react";
import theme from "../../../theme/theme";
import { ISupplier } from "../../../types/Supplier.type";
import ConfirmationModal from "../../organisms/ConfirmationModal/ConfirmationModal.component";

interface TableActionMenuProps {
  supplier: ISupplier;
  onEdit: (supplier: ISupplier) => void;
  onDelete: (id: number) => void;
}

const TableActionMenu = (props: TableActionMenuProps) => {
  const baseUrl = "https://www.google.com/maps/search/?api=1";
  const query = `${props.supplier.address.street} ${props.supplier.address.number}, ${props.supplier.address.city}, ${props.supplier.address.state}`;
  const url = `${baseUrl}&query=${encodeURIComponent(query)}`;

  const items = [
    {
      icon: <PencilLine size={18} />,
      label: "Edit supplier",
      onClick: () => {
        props.onEdit(props.supplier);
      }
    },
    {
      icon: <PhoneOutgoing size={18} />,
      label: "Open WhatsApp",
      onClick: () => {
        window.open(
          `https://wa.me/${props.supplier.contacts[0].phone.replace(/[^0-9]/g, "")}`,
          "_blank"
        );
      }
    },
    {
      icon: <MapPin size={18} />,
      label: "See location",
      onClick: () => {
        window.open(url, "_blank");
      }
    }
  ];

  return (
    <Menu shadow="md" position="bottom-end" width={200}>
      <Menu.Target>
        <ActionIcon size="lg" color={theme.color.primary.white} variant="subtle" radius="md">
          <CircleEllipsis cursor={"pointer"} size={24} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item, index) => (
          <Menu.Item
            color={theme.color.primary.dark}
            key={index}
            leftSection={item.icon}
            onClick={item.onClick}
          >
            {item.label}
          </Menu.Item>
        ))}

        <Menu.Divider />

        <Menu.Item color="red" leftSection={<Trash size={18} />}>
          <ConfirmationModal
            onConfirm={() => props.onDelete(props.supplier.id)}
            onCancel={() => {}}
            title="Delete supplier"
            text="Are you sure you want to delete this supplier? This action is irreversible."
          >
            Delete supplier
          </ConfirmationModal>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default TableActionMenu;
