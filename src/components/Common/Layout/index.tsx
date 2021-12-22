import { Flex } from "@chakra-ui/layout";
import Header from "./Header";
import Particles from "components/Common/Particles";

const Layout = ({ children }) => {
  return (
    <Flex
      height={{ base: "140vh", lg: "100vh" }}
      w="100%"
      flex={1}
      direction="column"
      justify="flex-start"
      align="flex-start"
      bg=""
      position="absolute"
      bgGradient="linear-gradient(124deg, rgba(172,13,13,1) 0%, rgba(255,176,141,1) 56%, rgba(242,186,186,1) 100%)"
    > 
      <Header />
      <Flex
        height="100%"
        width="100%"
        flex={1}
        direction="column"
        justify="flex-start"
        align="flex-start"
        zIndex={10}
      >
        {children}
      </Flex>
      <Particles />
    </Flex>
  );
};

export default Layout;
