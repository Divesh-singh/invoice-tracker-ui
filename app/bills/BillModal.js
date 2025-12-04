"use client";

import { useEffect, useState } from "react";
import { getBillById } from "../../services"; // <-- IMPORTANT

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function BillModal({ billId, open, onClose }) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const [amountReceived, setAmountReceived] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {

    if (!open) return; 
    if (!billId) return; 

    async function fetchBill() {
      setLoading(true);
      try {
        const res = await getBillById(billId);
        if (res?.bill) setBill(res.bill);
      } finally {
        setLoading(false);
      }
    }

    fetchBill();
  }, [open, billId]);


//   if (!open) return null;

  const totalPaid = bill?.payments?.reduce((acc, p) => acc + Number(p.amount_received), 0) || 0;
  const remaining = bill ? Number(bill.bill_amount) - totalPaid : 0;

  const submitPayment = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", bill.name);
    form.append("description", desc);
    form.append("amount_received", amountReceived);
    if (file) form.append("image", file);

    const res = await fetch(`/api/bills/${billId}/payment`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    if (res.ok) {
      onClose();
      window.location.reload();
    } else {
      alert("Failed to record payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        
        <DialogHeader>
          <DialogTitle>
            {bill?.name || "Loading..."}
          </DialogTitle>
          <DialogDescription>
            Bill details and payment history
          </DialogDescription>
        </DialogHeader>

        {loading || !bill ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">

            {/* BILL DETAILS */}
            <div className="grid grid-cols-2 gap-4 items-start">
            <div>
                <p className="text-sm"><strong>Bill Amount:</strong> ₹{bill.bill_amount}</p>
            </div>
            <div>
                <p className="text-sm"><strong>Total Paid:</strong> ₹{totalPaid}</p>
            </div>
            <div>
                <p className="text-sm"><strong>Remaining:</strong> ₹{remaining}</p>
            </div>
            <div>
                {bill.invoice_pdf_url && (
                <a
                    href={bill.invoice_pdf_url}
                    target="_blank"
                    className="text-blue-600 underline text-sm"
                >
                    View Original Invoice
                </a>
                )}
            </div>
            </div>



            {/* PAYMENT HISTORY */}
            <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Payment Records</h3>

            {bill.payments.length === 0 && (
                <p className="text-gray-500 text-sm">No payments yet.</p>
            )}

            <div className="space-y-2">
                {bill.payments.map((p) => (
                <div 
                    key={p.id} 
                    className="border p-2 rounded-md bg-gray-50 text-sm"
                >
                    <div className="flex justify-between">
                    <span><strong>Amount:</strong> ₹{p.amount_received}</span>
                    <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="truncate"><strong>Description:</strong> {p.description}</div>

                    {p.payment_invoice_url && (
                    <a 
                        href={p.payment_invoice_url}
                        target="_blank"
                        className="text-blue-600 underline text-xs"
                    >
                        View Receipt
                    </a>
                    )}
                </div>
                ))}
            </div>
            </div>

            {/* RECORD PAYMENT */}
            {bill && totalPaid < Number(bill.bill_amount) && (
            <form onSubmit={submitPayment} className="space-y-4">

                <div>
                <Label>Description</Label>
                <Textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Optional notes"
                />
                </div>

                <div>
                <Label>Amount Received</Label>
                <Input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    required
                />
                </div>

                <div>
                <Label>Upload Receipt/Image</Label>
                <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                </div>

                <DialogFooter>
                <Button type="submit">
                    Record Payment
                </Button>
                </DialogFooter>

            </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
