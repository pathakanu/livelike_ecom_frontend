import {
  Badge,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { ProductComparisonPayload } from "@/lib/types";

interface ProductComparisonProps {
  payload: ProductComparisonPayload;
}

export default function ProductComparison({
  payload,
}: ProductComparisonProps) {
  return (
    <Card variant="outline" borderRadius="xl">
      <CardBody>
        <Stack spacing={5}>
          <Heading size="sm">{payload.title}</Heading>
          {payload.entries.map((entry, index) => (
            <Stack key={entry.id} spacing={3}>
              <Stack direction="row" spacing={2} align="center">
                <Text fontWeight="semibold">{entry.headline}</Text>
                {entry.badge && (
                  <Badge colorScheme="pink" fontSize="0.65rem">
                    {entry.badge}
                  </Badge>
                )}
                {typeof entry.price === "number" && (
                  <Badge variant="subtle" colorScheme="purple">
                    ${entry.price.toFixed(2)}
                  </Badge>
                )}
              </Stack>
              <Stack spacing={1}>
                {entry.highlights.map((highlight) => (
                  <Text key={highlight} fontSize="sm" color="gray.600">
                    • {highlight}
                  </Text>
                ))}
              </Stack>
              <Stack spacing={1}>
                {entry.specs.map((spec) => (
                  <Text key={spec} fontSize="xs" color="gray.500">
                    {spec}
                  </Text>
                ))}
              </Stack>
              {index < payload.entries.length - 1 && (
                <Divider borderColor="gray.100" />
              )}
            </Stack>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
