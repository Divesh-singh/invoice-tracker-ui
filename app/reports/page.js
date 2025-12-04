"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getbillReport } from "@/services";

export default function BillReportPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!startDate || !endDate) return alert("Select both start and end dates");

    setLoading(true);

    // Construct ISO timestamps for start/end of day
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    try {
      const res = await getbillReport(startTime.toISOString(), endTime.toISOString());

      if (res && res.billData ) {
        setReportData(res);
      } else {
        alert(data.message || "Failed to fetch report");
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
                  <div className="grid grid-cols-3 text-sm gap-2 text-right min-w-[220px]">
                    <div>Bill: ₹{bill.bill_amount}</div>
                    <div>Paid: ₹{paidAmount}</div>
                    <div>Remaining: ₹{remaining}</div>
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
