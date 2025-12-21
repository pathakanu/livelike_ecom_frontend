import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ProductItem } from "@/lib/types";

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
    <Card variant="outline" borderRadius="xl" overflow="hidden">
      <Image
        src={product.image}
        alt={product.name}
        height="180px"
        width="100%"
        objectFit="cover"
      />
      <CardBody>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} align="center">
            <Heading size="sm">{product.name}</Heading>
            {product.badge && (
              <Badge colorScheme="purple" fontSize="0.65rem">
                {product.badge}
              </Badge>
            )}
          </Stack>
          <Text fontSize="sm" color="gray.600">
            {product.description}
          </Text>
          <Text fontWeight="semibold" fontSize="lg">
            {currency.format(product.price)}
          </Text>
          {typeof product.rating === "number" && (
            <Text fontSize="sm" color="gray.500">
              ⭐ {product.rating.toFixed(1)} customer rating
            </Text>
          )}
        </Stack>
      </CardBody>
      <CardFooter>
        <Button colorScheme="purple" width="100%">
          {ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
