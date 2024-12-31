import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Box, Button, useColorMode, useColorModeValue, Flex } from "@chakra-ui/react";
import Layout from "@/layout";
import styles from "@/styles/Home.module.css"; // Path ini sesuai dengan lokasi file


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { toggleColorMode } = useColorMode(); // Untuk toggle light/dark mode
  const bg = useColorModeValue("white", "gray.900"); // Latar belakang
  const textColor = useColorModeValue("black", "white"); // Warna teks
  const footerBg = useColorModeValue("gray.100", "gray.800"); // Latar belakang footer

  return (
    <Layout metaTitle="Home" metaDescription="Generated by create next app">
      {/* Global Wrapper */}
      <Box
        bg={bg}
        color={textColor}
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {/* Konten Utama */}
        <Flex
          as="main"
          flex="1"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          maxWidth="480px" // Membatasi lebar konten
          mx="auto"
          px={4}
        >
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol style={{ textAlign: "center" }}>
            <li>
              Get started by editing <code>pages/index.js</code>.
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className={styles.ctas} style={{ marginTop: "20px" }}>
            <a
              className={styles.primary}
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Read our docs
            </a>
          </div>
        </Flex>

        {/* Footer */}
        <Flex
          as="footer"
          bg={footerBg}
          width="100%"
          justifyContent="space-around"
          alignItems="center"
          py={4}
          px={4}
          boxShadow="sm"
        >
          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </Flex>

        {/* Tombol Toggle */}
        {/* <Button
          onClick={toggleColorMode}
          position="fixed"
          top={4}
          right={4}
          bg="teal.500"
          color="white"
        >
          Toggle {useColorModeValue("Dark", "Light")} Mode
        </Button> */}
      </Box>
    </Layout>
  );
}