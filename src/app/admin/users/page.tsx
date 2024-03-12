import Container from "@/components/container";
import { Heading1, Heading2 } from "@/components/typography";

import { UsersDataTable } from "./_components/users-data-table";
import { fetchUsers } from "@/data/fetch-users";

export default async function UserManagementPage() {
  const users = await fetchUsers();

  return (
    <Container>
      <Heading1 subheading="View and Manage users" className="mb-8">
        Users
      </Heading1>
      <UsersDataTable data={users} />
    </Container>
  );
}
