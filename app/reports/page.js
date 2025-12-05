"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getbillReport } from "@/services";
import { useUser } from '../../context/UserContext'

export default function BillReportPage() {
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
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!startDate || !endDate) return alert("Select both start and end dates");

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (start > end) return alert("Start date cannot be after end date");
    if (end > today) return alert("End date cannot exceed today");

    setLoading(true);

    // Construct ISO timestamps for start/end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    try {
      const res = await getbillReport(start.toISOString(), end.toISOString());

      if (res && res.billData) {
        setReportData(res);
      } else {
        alert(res?.message || "Failed to fetch report");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching report");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Bill Report</h1>

      {/* Date Selection */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={endDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button onClick={fetchReport} disabled={loading}>
          {loading ? "Fetching..." : "Get Report"}
        </Button>
      </div>

      {/* Report Summary */}
      {reportData && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md grid grid-cols-2 gap-4">
            <div><strong>Start Time:</strong> {new Date(reportData.startTime).toLocaleString()}</div>
            <div><strong>End Time:</strong> {new Date(reportData.endTime).toLocaleString()}</div>
            <div><strong>Total Bills:</strong> {reportData.billCount}</div>
            <div><strong>Total Amount Billed:</strong> ₹{reportData.totalAmountBilled}</div>
            <div><strong>Total Amount Received:</strong> ₹{reportData.totalAmountReceived}</div>
            <div><strong>Remaining:</strong> ₹{reportData.totalAmountBilled - reportData.totalAmountReceived}</div>
          </div>

          {/* Bills List */}
          <div className="space-y-3">
            {reportData.billData.map((bill) => {
              const paidAmount = bill.payments.reduce(
                (acc, p) => acc + Number(p.amount_received),
                0
              );
              const remaining = Number(bill.bill_amount) - paidAmount;

              return (
                <div
                  key={bill.id}
                  className="border p-3 rounded-md flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="font-semibold">{bill.name}</div>
                    <div className="text-sm text-gray-600">{bill.description}</div>
                  </div>
                  <div className="flex gap-4 min-w-[300px]]">
                    <div className="w-50">Bill: ₹{bill.bill_amount}</div>
                    <div className="w-50">Paid: ₹{paidAmount}</div>
                    <div className="w-50">Remaining: ₹{remaining}</div>
                  </div>

                  {bill.invoice_pdf_url && (
                    <a
                      href={bill.invoice_pdf_url}
                      target="_blank"
                      className="text-blue-600 underline text-sm ml-4"
                    >
                      View Invoice
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
