"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import { getAllUserTypes, register } from "../../services";

export default function AddUserForm() {

  const [userTypes, setUserTypes] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userTypeId, setUserTypeId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchUserTypes() {
      // Fetch user types from API if needed
      const res = await getAllUserTypes();
      if (res && res.userTypes) {
        const allowedUserTypes = res.userTypes.filter(type => type.name !== 'superadmin');
        setUserTypes(allowedUserTypes);
      }

    };
    fetchUserTypes();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await register({ firstName, lastName, userTypeId, username, password, confirmPassword })

    console.log("Register response:", res);

    //TODO: HANDLE ERROR IN A GLOBAL ALERT BANNER

    if (res && res.user) {
      setFirstName("");
      setLastName("");
      setUserTypeId("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      alert("User added successfully");
      window.location.reload(); // replace with prop function to refresh user list in parent component
    } else {
      alert("Failed to add user");
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>First Name</Label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Username</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>User Type ID</Label>
            <Select value={userTypeId} onValueChange={setUserTypeId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name.toUpperCase() === 'ADMIN' ? 'Admin' : 'User'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Add User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
