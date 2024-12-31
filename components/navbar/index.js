import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { FaHome, FaPlusSquare, FaBell, FaUser, FaList } from "react-icons/fa";
import { useRouter } from "next/router";

export default function BottomNavbar() {
    const router = useRouter();

    return (
        <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="teal.500"
            px={4}
            py={2}
            color="white"
            zIndex={10}
            shadow="lg"
        >
            <Flex
                justifyContent="space-between"
                alignItems="center"
                maxWidth="480px" // Batas lebar navbar mengikuti konten
                mx="auto"         // Center horizontal
                width="100%"      // Lebar penuh di mobile
            >
                {/* Home */}
                <Flex direction="column" align="center">
                    <IconButton
                        aria-label="Home"
                        icon={<FaHome />}
                        variant="ghost"
                        color="white"
                        size="lg"
                        onClick={() => router.push('/')}
                    />
                    <Text fontSize="xs">Home</Text>
                </Flex>

                {/* List Posts */}
                <Flex direction="column" align="center">
                    <IconButton
                        aria-label="My Posts"
                        icon={<FaList />}
                        variant="ghost"
                        color="white"
                        size="lg"
                        onClick={() => router.push('/posts')}
                    />
                    <Text fontSize="xs">My Post</Text>
                </Flex>

                {/* Add Post */}
                <Flex direction="column" align="center">
                    <IconButton
                        aria-label="Add Post"
                        icon={<FaPlusSquare />}
                        variant="ghost"
                        color="white"
                        size="lg"
                        onClick={() => router.push('/posts/add')}
                    />
                    <Text fontSize="xs">Add Post</Text>
                </Flex>

                {/* Notifications */}
                <Flex direction="column" align="center">
                    <IconButton
                        aria-label="Notifications"
                        icon={<FaBell />}
                        variant="ghost"
                        color="white"
                        size="lg"
                        onClick={() => router.push('/notifications')}
                    />
                    <Text fontSize="xs">Notif</Text>
                </Flex>

                {/* Profile */}
                <Flex direction="column" align="center">
                    <IconButton
                        aria-label="Profile"
                        icon={<FaUser />}
                        variant="ghost"
                        color="white"
                        size="lg"
                        onClick={() => router.push('/profile')}
                    />
                    <Text fontSize="xs">Profile</Text>
                </Flex>
            </Flex>
        </Box>
    );
}
