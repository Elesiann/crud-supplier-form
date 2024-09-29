import { Checkbox, Pagination, Select, Table, Text } from "@mantine/core";
import { useState } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import { ISupplier } from "../../../types/Supplier.type";
import phone_formatter from "../../../utils/phone_formatter";
import TableActionMenu from "../../atoms/TableActionmenu/TableActionMenu.component";

interface TableComponentProps {
  data: ISupplier[];
  onDelete: (id: number) => void;
  onEdit: (supplier: ISupplier) => void;
  setSelectedRows: (rows: ISupplier[]) => void;
  selectedRows: ISupplier[];
}

export default function TableComponent(props: TableComponentProps) {
  const { data, setSelectedRows, selectedRows } = props;
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activePage, setPage] = useState(1);
  const totalItems = data.length;
  const paginatedData = data.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const rows = paginatedData?.map((supplier) => {
    const { id, name, description, contacts, address } = supplier;
    const { street, number, city, state } = address;

    return (
      <Table.Tr key={id}>
        <Table.Td pl={24}>
          <Checkbox
            color={theme.color.primary.lightBlue}
            aria-label="Select row"
            checked={selectedRows.includes(supplier)}
            onChange={(event) =>
              setSelectedRows(
                event.target.checked
                  ? [...selectedRows, supplier]
                  : selectedRows.filter((row) => row.id !== id)
              )
            }
          />
        </Table.Td>
        <Table.Td>{id}</Table.Td>
        <Table.Td>{name}</Table.Td>
        <Table.Td>{description}</Table.Td>
        <Table.Td>
          {contacts
            .map((contact) => `${contact.name} - ${phone_formatter(contact.phone)}`)
            .join(", ")}
        </Table.Td>
        <Table.Td>{`${street}, ${number}, ${city} - ${state}`}</Table.Td>

        <Table.Td pr={24} align="center">
          <TableActionMenu supplier={supplier} onDelete={props.onDelete} onEdit={props.onEdit} />
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Table.ScrollContainer minWidth={800}>
        <GlassmorphismTable verticalSpacing={"md"}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th pl={24}>
                <Checkbox
                  color={theme.color.primary.lightBlue}
                  aria-label="Select all rows"
                  checked={selectedRows.length === data.length}
                  onChange={(event) => setSelectedRows(event.target.checked ? data : [])}
                />
              </Table.Th>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Contacts</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th pr={24}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </GlassmorphismTable>
      </Table.ScrollContainer>
      <Text mt={18}>
        Showing {activePage * itemsPerPage - itemsPerPage + 1} -{" "}
        {Math.min(activePage * itemsPerPage, totalItems)} of {totalItems} items.
      </Text>
      <PaginationWrapper>
        <Pagination
          className="pagination"
          color="white"
          onChange={setPage}
          value={activePage}
          total={Math.ceil(totalItems / itemsPerPage)}
          siblings={1}
          boundaries={1}
        />
        <Select
          label="Items per page"
          value={String(itemsPerPage)}
          onChange={(value) => {
            setItemsPerPage(Number(value));
            setPage(1);
          }}
          data={[
            { value: "5", label: "5" },
            { value: "10", label: "10" },
            { value: "15", label: "15" }
          ]}
        />
      </PaginationWrapper>
    </>
  );
}

const GlassmorphismTable = styled(Table)`
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.09);

  backdrop-filter: blur(3.9px);
  -webkit-backdrop-filter: blur(3.9px);

  padding: 2rem !important;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  align-items: end;

  .buttons_wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    align-items: end;

    label {
      font-size: ${theme.font.small};
    }
  }

  *:not(label) {
    color: ${theme.color.primary.dark};
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
    align-items: center;

    .pagination {
      width: 100%;
      div {
        display: flex;
        justify-content: space-evenly !important;
      }
    }
  }
`;
