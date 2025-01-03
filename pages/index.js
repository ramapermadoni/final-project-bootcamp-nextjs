import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { useQueries } from "@/hooks/useQueries";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import Layout from "@/layout";
import CommentsBottomSheet from "@/components/CommentsBottomSheet";
import { useRouter } from "next/router";
import { useDisclosure } from "@chakra-ui/react";
export default function Home() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { data, isLoading, isError } = useQueries({
    prefixUrl: "/api/posts?type=all",
    headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
  });
  const { mutate } = useMutation();
  const [likesState, setLikesState] = useState({});
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const handleLike = async (post) => {
    const postId = post.id;
    const isCurrentlyLiked = likesState[postId]?.isLiked ?? post.is_like_post;
  
    // Optimistic UI: Update state immediately
    setLikesState((prev) => ({
      ...prev,
      [postId]: {
        isLiked: !isCurrentlyLiked, // Toggle like state
        likeCount: isCurrentlyLiked
          ? (prev[postId]?.likeCount ?? post.likes_count) - 1 // Decrease like count if unliking
          : (prev[postId]?.likeCount ?? post.likes_count) + 1, // Increase like count if liking
      },
    }));
  
    try {
      const endpoint = isCurrentlyLiked
        ? `/api/unlikes/post/${postId}` // If already liked, call unlike endpoint
        : `/api/likes/post/${postId}`; // If not liked, call like endpoint
  
      // console.log("URL endpoint:", endpoint);
  
      const response = await mutate({
        url: endpoint,
        method: "POST",
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
      });
  
      // console.log("API Response:", response);
  
      // Update state based on server response
      if (response?.success) {
        setLikesState((prev) => ({
          ...prev,
          [postId]: {
            isLiked: !isCurrentlyLiked, // Ensure toggle is applied based on response
            likeCount: response?.data?.likes_count ?? prev[postId]?.likeCount, // Use API response count
          },
        }));
      } else {
        throw new Error("Server did not respond with success");
      }
    } catch (error) {
      console.error("Error updating like state:", error.message);
  
      // Revert state if API request fails
      setLikesState((prev) => ({
        ...prev,
        [postId]: {
          isLiked: isCurrentlyLiked, // Revert to original state
          likeCount: prev[postId]?.likeCount ?? post.likes_count, // Reset to original count
        },
      }));
    }
  };  
  
  const handleDelete = async () => {
    setIsDeletingPost(true);
    try {
      const response = await mutate({
        url: `/api/post/delete/${selectedPostId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
      });

      if (response?.success) {
        toast({
          title: "Success",
          description: "Post deleted successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        router.reload();
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to delete post. Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsDeletingPost(false);
      onClose();
    }
  };


  if (isLoading) {
    return (
    <Layout metaTitle="Home" metaDescription="Home Page">
      <Flex justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    </Layout>
    );
  }

  if (isError || !data?.success) {
    return (
    <Layout metaTitle="Home" metaDescription="Home Page">
      <Flex justifyContent="center" alignItems="center" h="100vh">
        <Alert status="error">
          <AlertIcon />
          Gagal mengambil data posting. Silakan coba lagi.
        </Alert>
      </Flex>
    </Layout>
    );
  }

  return (
    <Layout metaTitle="Home" metaDescription="Home Page">
      <Box mt={16} mb={24}>
        <Stack spacing={4}>
          {data.data.length > 0 ? ( // Cek apakah ada postingan
            data.data.map((post) => {
              const currentState = likesState[post.id] || {
                isLiked: post.is_like_post,
                likeCount: post.likes_count,
              };
  
              return (
                <Box
                  key={post.id}
                  width="100%"
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontWeight="bold" fontSize="sm">
                    {post.user.name}
                  </Text>
                  <Text fontSize="sm">{post.description}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(post.created_at).toLocaleString()}
                  </Text>
                    <Flex mt={4} alignItems="left">
                      {/* Like Icon and Count */}
                      <Flex alignItems="center" mr={8}>
                        <IconButton
                          aria-label="Like post"
                          icon={
                            currentState.isLiked ? (
                              <AiFillHeart color="red" />
                            ) : (
                              <AiOutlineHeart />
                            )
                          }
                          onClick={() => handleLike(post)}
                          variant="ghost"
                        />
                        <Text>{currentState.likeCount}</Text>
                      </Flex>
  
                      {/* Comment Icon and Count */}
                      <Flex alignItems="center">
                        <CommentsBottomSheet postId={post.id} />
                        <Text>{post.replies_count}</Text>
                      </Flex>
                    </Flex>
  
                    {post.is_own_post && (
                      <Flex mt={4} gap={4}>
                        <Button
                          colorScheme="teal"
                          size="sm"
                          onClick={() => router.push(`/posts/edit/${post.id}`)}
                        >
                          Edit Post
                        </Button>

                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => {
                            setSelectedPostId(post.id);
                            onOpen();
                          }}
                        >
                          Delete Post
                        </Button>
                      </Flex>
                    )}
                </Box>
              );
            })
          ) : (
            <Flex justifyContent="center" alignItems="center" height="70vh">
              <Text color="gray.500" fontSize="lg">
                Belum ada postingan.
              </Text>
            </Flex>    
          )}
        </Stack>
      </Box>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" isLoading={isDeletingPost} onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );  
}
