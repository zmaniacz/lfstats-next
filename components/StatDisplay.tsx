import { Stat, StatHelpText, StatNumber } from "@chakra-ui/react";
import { FC } from "react";

interface StatProps {
  name: string;
  value: string | number;
  size?: string;
}

export const StatDisplay: FC<StatProps> = ({ name, value, size = "sm" }) => (
  <Stat size={size} mx={2}>
    <StatNumber>{value}</StatNumber>
    <StatHelpText>{name}</StatHelpText>
  </Stat>
);
