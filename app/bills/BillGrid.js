"use client";

import { useEffect, useState } from "react";
import BillCard from "./BillCard";
import BillModal from "./BillModal";
import { getAllBills } from "@/services";

export default function BillGrid() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);  

  useEffect(() => {
    async function fetchBills() {
      const res = await getAllBills();
      if (res && Array.isArray(res.bills)) {
        setBills(res.bills);
      }
    }
    fetchBills();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {bills.map(bill => (
          <BillCard 
            key={bill.id} 
            bill={bill} 
            onClick={() => setSelectedBill(bill.id)} 
          />
        ))}
      </div>

      {/* Modal */}
      <BillModal 
        billId={selectedBill}
        open={!!selectedBill}
        onClose={() => setSelectedBill(null)}
      />
    </>
  );
}
