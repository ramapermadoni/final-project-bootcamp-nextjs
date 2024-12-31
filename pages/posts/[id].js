import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Box, Text, Flex, Spinner, IconButton, Button } from "@chakra-ui/react";
import { useQueries } from "@/hooks/useQueries";
import Layout from "@/layout";
import Cookies from "js-cookie";
import { AiFillHeart, AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import CommentsBottomSheet from "@/components/CommentsBottomSheet";

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
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
  const { data, isLoading, isError } = useQueries({
    prefixUrl: `/api/post/${id}`,
    headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
  });

  if (isLoading) {
    return (
      <Layout metaTitle="Post Detail">
        <Flex justifyContent="center" alignItems="center" h="50vh">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  if (isError || !data?.success) {
    return (
      <Layout metaTitle="Post Detail">
        <Flex justifyContent="center" alignItems="center" h="50vh">
          <Text color="red.500">Failed to fetch post. Try again later.</Text>
        </Flex>
      </Layout>
    );
  }

  const post = data.data;
console.log(post);

const currentState = likesState[post.id] || {
    isLiked: post.is_like_post,
    likeCount: post.likes_count,
  };
  return (
    <Layout metaTitle="Post Detail">
    <Box
      mt={16} mb={24}
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
              onClick={() => router.push(`/editpost/${post.id}`)}
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
    </Layout>
  );
}
