import { HoverCard, Box, Text, Portal, Strong } from "@chakra-ui/react";

function BotaoAjuda({ children }) {
  return (
    <HoverCard.Root size="sm" openDelay={50} closeDelay={50}>
      <HoverCard.Trigger asChild>
        <Box
          width="25px"
          height="25px"
          borderRadius="25px"
          border="3px solid #474747"
          bg="#bababa"
          fontSize="14px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
        >
          <Text>
            <Strong>?</Strong>
          </Text>
        </Box>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content
            maxWidth="500px"
            p="4"
            bg="white"
            borderRadius="md"
            boxShadow="xl"
          >
            <HoverCard.Arrow />
            <Box whiteSpace="normal" textAlign="left">
              {children}
            </Box>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}

export default BotaoAjuda;
