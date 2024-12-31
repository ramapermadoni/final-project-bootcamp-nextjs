import React from "react";
import { Box, Stack, Text, Flex } from "@chakra-ui/react";
import { useQueries } from "@/hooks/useQueries";
import Layout from "@/layout";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Notifications() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useQueries({
    prefixUrl: "/api/notifications",
    headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
  });

  if (isLoading) {
    return (
      <Layout metaTitle="Notifications">
        <Flex justifyContent="center" alignItems="center" h="50vh">
          <Text>Loading notifications...</Text>
        </Flex>
      </Layout>
    );
  }

  if (isError || !data?.success) {
    return (
      <Layout metaTitle="Notifications">
        <Flex justifyContent="center" alignItems="center" h="50vh">
          <Text color="red.500">Failed to fetch notifications. Try again later.</Text>
        </Flex>
      </Layout>
    );
  }

  const notifications = data.data || [];

  return (
    <Layout metaTitle="Notifications">
      <Stack spacing={4} 
            mt={16}
            mb={24}>
        {notifications.map((notification) => (
          <Box
            key={notification.id}
            p={4}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            bg={notification.read ? "gray.50" : "blue.50"}
            cursor="pointer"
            onClick={() => router.push(`/posts/${notification.posts.id}`)}
          >
            <Text fontWeight="bold">
              {notification.remark === "like"
                ? `${notification.user.name} menyukai postingan Anda.`
                : `${notification.user.name} mengomentari postingan Anda.`}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(notification.created_at).toLocaleString()}
            </Text>
          </Box>
        ))}
      </Stack>
    </Layout>
  );
}
