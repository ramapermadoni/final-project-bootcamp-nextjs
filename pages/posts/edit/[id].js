import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    FormControl,
    FormErrorMessage,
    Heading,
    Textarea,
    Stack,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { useQueries } from "@/hooks/useQueries";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Layout from "@/layout";

export default function EditPost() {
    const router = useRouter();
    const toast = useToast();
    const { id } = router.query; // Get the post ID from the query parameter
    const { mutate } = useMutation();
    const [payload, setPayload] = useState({
        description: "",
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [errors, setErrors] = useState({}); // Untuk menyimpan pesan error

    const { data, isLoading, isError } = useQueries({
        prefixUrl: id ? `/api/post/${id}` : null,
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
    });

    // Prefill the form once the data is loaded
    if (data?.success && payload.description === "") {
        setPayload({ description: data.data.description });
    }

    const validate = () => {
        const newErrors = {};
        if (!payload.description) newErrors.description = "Deskripsi harus diisi.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Jika tidak ada error, validasi berhasil
    };

    const HandleSubmit = async () => {
        if (!validate()) return; // Validasi sebelum submit
        setIsUpdating(true);
        try{
                const response = await mutate({
                    url: `/api/post/update/${id}`,
                    method: "PATCH",
                    payload: payload,
                    headers: { "Authorization": `Bearer ${Cookies.get("user_token")}` },
                });

                if (!response?.success) {
                    toast({
                        title: "Gagal Mengupdate Post",
                        description: "Silakan periksa data Anda",
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                    });
                } else {
                    toast({
                        title: "Post Berhasil Diupdate",
                        description: "Post Anda berhasil diperbarui",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                    });
                    router.push(`/posts`); // Redirect back to the posts list
                }
        }catch(error){
            toast({
                title: "Gagal Mengupdate Post",
                description: "Silakan periksa data Anda",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
        }finally{
            setIsUpdating(false);   
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
    
    if (isError) {
        return (
            <Flex alignItems="center" justifyContent="center" h="100vh" bg="gray.50">
                <Heading as="h4" size="lg">Gagal mengambil data. Silakan coba lagi.</Heading>
            </Flex>
        );
    }

    return (
        <Layout metaTitle="Edit Post">
        <Flex alignItems="center" justifyContent="center" h="100vh" bg="gray.50">
            <Stack direction="column" spacing={8} maxW="400px" w="100%">
                <Card
                    bg="white"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow={"base"}
                >
                    <CardHeader>
                        <Heading as="h4" size="lg" textAlign="center">
                            Edit Post
                        </Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack spacing={4}>
                            <FormControl isInvalid={!!errors.description}>
                                <Textarea
                                    placeholder="Edit deskripsi post Anda di sini..."
                                    value={payload.description}
                                    onChange={(event) =>
                                        setPayload({ ...payload, description: event.target.value })
                                    }
                                    focusBorderColor="teal.400"
                                />
                                {errors.description && (
                                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                                )}
                            </FormControl>
                        </Stack>
                    </CardBody>
                    <CardFooter flexDirection="column" gap={4}>
                        <Button w="100%" isLoading={isUpdating} colorScheme="teal" onClick={() => HandleSubmit()}>
                            Update Post
                        </Button>
                    </CardFooter>
                </Card>
            </Stack>
        </Flex>
        </Layout>
    );
}
