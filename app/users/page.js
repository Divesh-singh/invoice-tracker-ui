"use client";


import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";
import { useUser } from '../../context/UserContext'

export default function UsersPage() {

  const { user, setUser } = useUser()
  const userAccessLevel = user?.user?.userType?.access_level || 0;

  if (userAccessLevel < 2) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold text-red-600">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <UserTable />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <AddUserForm />
      </div>
    </div>
  );
}
