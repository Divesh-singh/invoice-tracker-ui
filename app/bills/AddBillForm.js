"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddBillForm() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    form.append("description", desc);
    form.append("bill_amount", billAmount);
    form.append("amount_received", amountReceived);
    if (file) form.append("image", file);

    const res = await fetch("/api/bills", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    if (res.ok) {
      setName("");
      setDesc("");
      setBillAmount("");
      setAmountReceived("");
      setFile(null);
      window.location.reload();
    } else {
      alert("Failed to add bill");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Bill</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Name */}
          <div>
            <Label>Bill Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea value={desc} onChange={e => setDesc(e.target.value)} required />
          </div>

          {/* Bill Amount */}
          <div>
            <Label>Bill Amount</Label>
            <Input
              type="number"
              value={billAmount}
              onChange={e => setBillAmount(e.target.value)}
              required
            />
          </div>

          {/* Amount Received */}
          <div>
            <Label>Amount Received</Label>
            <Input
              type="number"
              value={amountReceived}
              onChange={e => setAmountReceived(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div>
            <Label>Invoice Image</Label>
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>

          <Button type="submit" className="w-full">Add Bill</Button>
        </form>
      </CardContent>
    </Card>
  );
}
