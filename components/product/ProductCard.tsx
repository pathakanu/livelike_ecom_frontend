import { ProductItem } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: ProductItem;
  ctaLabel?: string;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ProductCard({
  product,
  ctaLabel = "View details",
}: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-slate-100 bg-white shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
        loading="lazy"
      />
      <CardContent className="flex flex-1 flex-col gap-3 p-5 text-slate-400">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{product.name}</h3>
          {product.badge && (
            <Badge className="bg-purple-100 text-purple-600">
              {product.badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-500">{product.description}</p>
        <p className="text-lg font-semibold">{currency.format(product.price)}</p>
        {typeof product.rating === "number" && (
          <p className="text-sm text-slate-500">
            ⭐ {product.rating.toFixed(1)} customer rating
          </p>
        )}
      </CardContent>
      <CardFooter className="px-5 pb-5">
        <Button className="w-full rounded-xl py-3 text-sm font-semibold">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
