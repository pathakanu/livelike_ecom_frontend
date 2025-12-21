import {
  Badge,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { CartSummaryPayload } from "@/lib/types";

interface CartSummaryProps {
  payload: CartSummaryPayload;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CartSummary({ payload }: CartSummaryProps) {
  return (
    <Card variant="outline" borderRadius="xl">
      <CardBody>
        <Stack spacing={4}>
          <Heading size="sm">Cart Summary</Heading>
          <Stack spacing={3}>
            {payload.items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                justify="space-between"
                align="center"
              >
                <Stack spacing={1}>
                  <Text fontWeight="medium">{item.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    Qty {item.quantity}
                  </Text>
                </Stack>
                <Badge colorScheme="purple">
                  {currency.format(item.price * item.quantity)}
                </Badge>
              </Stack>
            ))}
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <SummaryRow label="Subtotal" value={currency.format(payload.subtotal)} />
            <SummaryRow label="Shipping" value={currency.format(payload.shipping)} />
            <SummaryRow label="Tax" value={currency.format(payload.tax)} />
            <SummaryRow
              label="Total"
              value={currency.format(payload.total)}
              emphasize
            />
          </Stack>
          {payload.note && (
            <Text fontSize="sm" color="gray.600">
              {payload.note}
            </Text>
          )}
          <Button colorScheme="purple" size="lg">
            Checkout Securely
          </Button>
        </Stack>
      </CardBody>
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
    <Stack direction="row" justify="space-between" align="center">
      <Text fontSize={emphasize ? "md" : "sm"} fontWeight={emphasize ? "bold" : "medium"}>
        {label}
      </Text>
      <Text fontSize={emphasize ? "md" : "sm"} fontWeight={emphasize ? "bold" : "semibold"}>
        {value}
      </Text>
    </Stack>
  );
}
