import { ProductComparisonPayload } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProductComparisonProps {
  payload: ProductComparisonPayload;
}

export default function ProductComparison({
  payload,
}: ProductComparisonProps) {
  return (
    <Card className="bg-white">
      <CardContent className="space-y-5 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {payload.title}
        </h3>
        {payload.entries.map((entry, index) => (
          <div key={entry.id} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-slate-900">
                {entry.headline}
              </p>
              {entry.badge && (
                <Badge className="bg-pink-100 text-pink-600">{entry.badge}</Badge>
              )}
              {typeof entry.price === "number" && (
                <Badge className="bg-purple-50 text-purple-600">
                  ${entry.price.toFixed(2)}
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              {entry.highlights.map((highlight) => (
                <p key={highlight}>• {highlight}</p>
              ))}
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              {entry.specs.map((spec) => (
                <p key={spec}>{spec}</p>
              ))}
            </div>
            {index < payload.entries.length - 1 && (
              <Separator className="border-dashed border-slate-200" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
