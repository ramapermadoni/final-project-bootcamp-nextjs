import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Center,
} from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { useQueries } from "@/hooks/useQueries";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import Layout from "@/layout";
import CommentsBottomSheet from "@/components/CommentsBottomSheet";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  const { data, isLoading, isError } = useQueries({
    prefixUrl: "/api/posts?type=all",
    headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
  });
  const { mutate } = useMutation();
  const [likesState, setLikesState] = useState({});

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
  
      console.log("URL endpoint:", endpoint);
  
      const response = await mutate({
        url: endpoint,
        method: "POST",
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
      });
  
      console.log("API Response:", response);
  
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
      <Box mt={8} mb={24}>
        <Stack spacing={4}>
          {data.data.length > 0 ? ( // Cek apakah ada postingan
            data.data.map((post) => {
              const currentState = likesState[post.id] || {
                isLiked: post.is_like_post,
                likeCount: post.likes_count,
              };
  
              return (
                <Card key={post.id} boxShadow="md" p={4}>
                  <CardHeader>
                    <Heading as="h3" size="md">
                      {post.user.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(post.created_at).toLocaleDateString()}{" "}
                      {new Date(post.created_at).toLocaleTimeString()}
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Text>{post.description}</Text>
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
                      <Button mt={4} colorScheme="teal" size="sm" onClick={() => router.push(`/editpost/${post.id}`)}>
                        Edit Post
                      </Button>
                    )}
                  </CardBody>
                </Card>
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
    </Layout>
  );  
}
