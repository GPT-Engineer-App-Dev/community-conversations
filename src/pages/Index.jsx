import { Box, Container, VStack, Text, Heading, Input, Textarea, Button, HStack, Flex, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { useGuestAuth } from "../integrations/supabase/index.js";
import { usePosts, useAddPost, useAddReaction } from "../integrations/supabase/index.js";

const Index = () => {
  const guestUser = useGuestAuth();
  const { data: posts, isLoading, isError } = usePosts();
  const addPostMutation = useAddPost();
  const addReactionMutation = useAddReaction();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePostSubmit = () => {
    if (title && content) {
      addPostMutation.mutate({ title, body: content });
      setTitle("");
      setContent("");
    }
  };

  const handleReaction = (postId, emoji) => {
    if (guestUser) {
      const existingReaction = posts.find(post => post.id === postId).reactions.find(reaction => reaction.user_id === guestUser.id && reaction.emoji === emoji);
      if (existingReaction) {
        // Remove reaction
        addReactionMutation.mutate({ id: existingReaction.id, post_id: postId, emoji, user_id: guestUser.id }, { method: 'DELETE' });
      } else {
        // Add reaction
        addReactionMutation.mutate({ post_id: postId, emoji, user_id: guestUser.id });
      }
    }
  };

  return (
    <Container maxW="container.lg" p={4}>
      <Flex as="nav" bg="blue.500" color="white" p={4} mb={4} justifyContent="center">
        <Heading size="lg">Public Post Board</Heading>
      </Flex>
      <VStack spacing={4} align="stretch">
        <Box as="form" p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Create a Post</Heading>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={2}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            mb={2}
          />
          <Button colorScheme="blue" onClick={handlePostSubmit} isLoading={addPostMutation.isLoading}>Submit</Button>
        </Box>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <Text color="red.500">Error loading posts</Text>
        ) : (
          posts.map((post) => (
            <Box key={post.id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Heading size="md">{post.title}</Heading>
              <Text mt={2}>{post.body}</Text>
              <Text mt={2} fontSize="sm" color="gray.500">{post.created_at}</Text>
              <HStack spacing={2} mt={2}>
                {post.reactions?.map((reaction) => (
                  <Text key={reaction.id}>{reaction.emoji}</Text>
                ))}
                <Button
                  size="sm"
                  colorScheme={post.reactions?.some(reaction => reaction.user_id === guestUser.id && reaction.emoji === "👍") ? "green" : "gray"}
                  onClick={() => handleReaction(post.id, "👍")}
                >
                  👍
                </Button>
                <Button
                  size="sm"
                  colorScheme={post.reactions?.some(reaction => reaction.user_id === guestUser.id && reaction.emoji === "❤️") ? "green" : "gray"}
                  onClick={() => handleReaction(post.id, "❤️")}
                >
                  ❤️
                </Button>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;