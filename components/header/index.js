import { Box, Flex, Heading, IconButton, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AiOutlineArrowLeft } from "react-icons/ai";

const Header = ({ title = "Judul Halaman", showBackButton = false }) => {
  const router = useRouter();

  return (
    <Box
      bg="teal.600" // Warna hijau yang sama dengan BottomNavbar
    //   py={4}
      px={6}
    h="60px"
      color="white"
      boxShadow="sm"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10} // Menjamin header tetap di atas elemen lainnya
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        maxWidth="480px" // Menyesuaikan dengan maxWidth BottomNavbar
        mx="auto"         // Center horizontal
        width="100%"      // Lebar penuh di mobile
        h="100%" // Pastikan Flex mengambil seluruh tinggi header
      >
        {showBackButton && (
          <IconButton
            aria-label="Back"
            icon={<AiOutlineArrowLeft />}
            variant="ghost"
            colorScheme="whiteAlpha"
            fontSize="20px"
            mr={4}
            onClick={() => router.back()}
          />
        )}
        <Flex alignItems="center" width="100%">
          <Image
            src="/next.svg" // Path logo Next.js, pastikan file ini ada di folder public
            alt="Next.js Logo"
            width={24}
            height={24}
            mr={8}
          />
          <Heading as="h1" size="md" isTruncated>
            {title}
          </Heading>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
