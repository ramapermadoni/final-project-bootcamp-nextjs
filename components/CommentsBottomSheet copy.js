import {
  Box,
  IconButton,
  Flex,
  Text,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useQueries } from "@/hooks/useQueries";

const CommentsBottomSheet = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Memoisasi headers agar stabil
  const memoizedHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    }),
    []
  );

  // Fetch comments hanya jika isOpen true
  const { data: commentsData, isLoading, isError } = useQueries({
    prefixUrl: isOpen ? `/api/replies/post/${postId}` : null, // Tidak fetch jika null
    headers: memoizedHeaders,
    enabled: isOpen, // Kendali penuh berdasarkan isOpen
  });

  const toggleBottomSheet = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Comment Icon */}
      <IconButton
        aria-label="Comments"
        icon={<FaRegComment />}
        variant="ghost"
        colorScheme="teal"
        onClick={toggleBottomSheet}
      />

      {/* Bottom Sheet */}
      {isOpen && (
        <Box
          position="fixed"
          bottom="0"
          left="0"
          width="100%"
          maxHeight="60vh"
          bg="white"
          boxShadow="0 -2px 5px rgba(0,0,0,0.2)"
          borderTopRadius="lg"
          overflowY="auto"
          zIndex="1000"
        >
          {/* Header */}
          <Flex
            justifyContent="space-between"
            alignItems="center"
            p={4}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <Text fontWeight="bold" fontSize="lg">
              Comments
            </Text>
            <IconButton
              icon={<AiOutlineClose />}
              aria-label="Close"
              variant="ghost"
              onClick={toggleBottomSheet}
            />
          </Flex>

          {/* Comments Section */}
          <VStack spacing={4} p={4}>
            {isLoading && (
              <Center>
                <Spinner size="lg" />
              </Center>
            )}

            {isError && (
              <Center>
                <Text color="red.500">Failed to fetch comments.</Text>
              </Center>
            )}

            {commentsData?.data?.length > 0 ? (
              commentsData.data.map((comment) => (
                <Box
                  key={comment.id}
                  width="100%"
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontWeight="bold" fontSize="sm">
                    {comment.user.name}
                  </Text>
                  <Text fontSize="sm">{comment.description}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(comment.created_at).toLocaleString()}
                  </Text>
                </Box>
              ))
            ) : (
              !isLoading && (
                <Center>
                  <Text>No comments yet.</Text>
                </Center>
              )
            )}
          </VStack>
        </Box>
      )}
    </>
  );
};

export default CommentsBottomSheet;
