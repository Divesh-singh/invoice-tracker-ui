"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { getAllUsers } from "../../services"; // your API call function


export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        if(data && data.users){
          setUsers(data?.users || []);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (!users.length) {
    return <p>No users found.</p>;
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>User Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user?.first_name + ' ' + user?.last_name}</TableCell>
              <TableCell>{user?.username}</TableCell>
              <TableCell>{user?.userType?.name !== 'superadmin' ? user?.userType?.name === 'admin' ? 'Admin' : 'User' : 'Super Admin'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
