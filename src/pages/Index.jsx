import { Box, Container, VStack, Text, Heading, Input, Textarea, Button, HStack, Flex } from "@chakra-ui/react";
import { useState } from "react";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePostSubmit = () => {
    if (title && content) {
      const newPost = {
        title,
        content,
        timestamp: new Date().toLocaleString(),
      };
      setPosts([newPost, ...posts]);
      setTitle("");
      setContent("");
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
          <Button colorScheme="blue" onClick={handlePostSubmit}>Submit</Button>
        </Box>
        {posts.map((post, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading size="md">{post.title}</Heading>
            <Text mt={2}>{post.content}</Text>
            <Text mt={2} fontSize="sm" color="gray.500">{post.timestamp}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;