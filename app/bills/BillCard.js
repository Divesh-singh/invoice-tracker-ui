import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BillCard({ bill, onClick }) {
  return (
    <Card 
      className="shadow-sm border cursor-pointer hover:bg-gray-50 transition"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{bill.name}</span>
          <span className={bill.paid ? "text-green-600" : "text-red-600"}>
            {bill.paid ? "Paid" : "Unpaid"}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600">{bill.description}</p>
        <div><strong>Amount:</strong> ₹{bill.bill_amount}</div>
      </CardContent>
    </Card>
  );
}
