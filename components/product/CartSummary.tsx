import { CartSummaryPayload } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartSummaryProps {
  payload: CartSummaryPayload;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CartSummary({ payload }: CartSummaryProps) {
  return (
    <Card className="bg-white">
      <CardContent className="space-y-4 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Cart Summary
        </h3>
        <div className="space-y-3">
          {payload.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">Qty {item.quantity}</p>
              </div>
              <Badge className="bg-purple-100 text-purple-600">
                {currency.format(item.price * item.quantity)}
              </Badge>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-slate-200 pt-4">
          <SummaryRow label="Subtotal" value={currency.format(payload.subtotal)} />
          <SummaryRow label="Shipping" value={currency.format(payload.shipping)} />
          <SummaryRow label="Tax" value={currency.format(payload.tax)} />
          <SummaryRow
            label="Total"
            value={currency.format(payload.total)}
            emphasize
          />
        </div>
        {payload.note && (
          <p className="text-sm text-slate-600">{payload.note}</p>
        )}
        <Button className="w-full rounded-xl py-3 text-sm font-semibold">
          Checkout Securely
        </Button>
      </CardContent>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className={emphasize ? "font-bold text-slate-900" : "font-medium text-slate-600"}>
        {label}
      </span>
      <span className={emphasize ? "text-base font-bold text-slate-900" : "font-semibold text-slate-700"}>
        {value}
      </span>
    </div>
  );
}
