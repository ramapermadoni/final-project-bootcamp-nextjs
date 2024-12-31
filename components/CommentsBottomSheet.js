import {
  Box,
  IconButton,
  Flex,
  Text,
  VStack,
  Spinner,
  Center,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useMemo, useEffect } from "react";
import Cookies from "js-cookie";
import { useQueries } from "@/hooks/useQueries";
import { useMutation } from "@/hooks/useMutation";

const CommentsBottomSheet = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState(""); // State untuk input komentar baru
  const [comments, setComments] = useState([]); // State untuk menyimpan komentar
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
const { mutate } = useMutation();
const toast = useToast();
// const [selectedCommentId, setSelectedCommentId] = useState(null);

  // Memoisasi headers agar stabil
  const memoizedHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    }),
    []
  );

  // Fetch comments hanya jika isOpen true
  const { data: commentsData, isLoading, isError, refetch } = useQueries({
    prefixUrl: isOpen ? `/api/replies/post/${postId}` : null, // Tidak fetch jika null
    headers: memoizedHeaders,
    enabled: isOpen, // Kendali penuh berdasarkan isOpen
  }); 


  const handleAddComment = async () => {
    setIsAddingComment(true);
    if (newComment.trim() !== "") {
      const response = await mutate({
        url: `/api/replies/post/${postId}`,
        method: "POST",
        headers: memoizedHeaders,
        payload:{
            description: newComment,},
        onSuccess: (newCommentData) => {
          setIsAddingComment(false);
          // setComments((prevComments) => [...prevComments, newCommentData]); // Tambahkan komentar baru ke daftar
          setNewComment(""); // Reset input setelah sukses
          refetch();
        },
      });

      if (!response?.success) {
          toast({
              title: "Gagal Menambahkan Comment",
              description: "Silakan periksa data Anda",
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top",
          });
          setIsAddingComment(false);
      } else {
        refetch();
          toast({
              title: "Comment Berhasil Ditambahkan",
              description: "Comment Anda berhasil disimpan",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
          });
          setIsAddingComment(false);
          setNewComment(""); // Reset input setelah sukses
      }
    //
    }
  };

  const handleDeleteComment = async (commentId) => {
    setIsDeletingComment(true);
    try {
      const response = await mutate({
        url: `/api/replies/delete/${commentId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
      });

      if (response?.success) {
        toast({
          title: "Success",
          description: "Comment deleted successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        refetch();
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to delete comment. Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsDeletingComment(false);
      refetch();
    }
  };
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
                  {
                    comment.is_own_reply && (
                      <Button
                        size="xs"
                        colorScheme="red"
                        isLoading={isDeletingComment}
                        onClick={() => {
                          handleDeleteComment(comment.id);
                        }}
                      >
                        Delete
                      </Button>
                    )
                  }
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

          {/* Add Comment Section */}
          <Flex
            p={4}
            bg="gray.100"
            borderTop="1px solid"
            borderColor="gray.200"
            alignItems="center"
            position="sticky"
            bottom="0"
          >
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e)=> {
                setNewComment(e.target.value);
              }}
              mr={2}
              isDisabled={isAddingComment}
            />
            <Button
              colorScheme="teal"
              onClick={handleAddComment}
              isLoading={isAddingComment}
              isDisabled={!newComment.trim()}
            >
              Submit
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default CommentsBottomSheet;
