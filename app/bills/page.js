"use client";

import BillGrid from "./BillGrid";
import AddBillForm from "./AddBillForm";

export default function BillsPage() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT SIDE — Scrollable Bill Cards */}
      <div className="h-[85vh] overflow-y-auto pr-4">
        <h2 className="text-xl font-semibold mb-4">Bills</h2>
        <BillGrid />
      </div>

      {/* RIGHT SIDE — Add Bill Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Add Bill</h2>
        <AddBillForm />
      </div>
    </div>
  );
}
