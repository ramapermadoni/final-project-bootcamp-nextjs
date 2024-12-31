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
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Layout from "@/layout";

export default function AddPost() {
    const router = useRouter();
    const toast = useToast();
    const { mutate } = useMutation();
    const [payload, setPayload] = useState({
        description: "",
    });
    const [errors, setErrors] = useState({}); // Untuk menyimpan pesan error
    const [isLoading, setIsLoading] = useState(false); // State untuk loading

    const validate = () => {
        const newErrors = {};
        if (!payload.description) newErrors.description = "Deskripsi harus diisi.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Jika tidak ada error, validasi berhasil
    };

    const HandleSubmit = async () => {
        if (!validate()) return; // Validasi sebelum submit
        setIsLoading(true);
        try {
            const response = await mutate({
                url: "/api/post",
                payload: payload,
                headers: { "Authorization": `Bearer ${Cookies.get("user_token")}` },
            });

            if (!response?.success) {
                toast({
                    title: "Gagal Menambahkan Post",
                    description: "Silakan periksa data Anda",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                });
            } else {
                toast({
                    title: "Post Berhasil Ditambahkan",
                    description: "Post Anda berhasil disimpan",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                });
                setPayload({ description: "" }); // Reset form
                router.push("/posts");
            }
        }catch (error) {
            toast({
                title: "Terjadi Kesalahan",
                description: "Silakan coba lagi.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
        }finally {
            setIsLoading(false);
        }
        
    };

    return (
        <Layout metaTitle="Tambah Post">
        <Flex alignItems="top" pt={20} justifyContent="center" h="100vh" bg="white">
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
                            Tambah Post Baru
                        </Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack spacing={4}>
                            <FormControl isInvalid={!!errors.description}>
                                <Textarea
                                    placeholder="Tulis deskripsi post Anda di sini..."
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
                        <Button w="100%" colorScheme="teal" isLoading={isLoading} onClick={() => HandleSubmit()}>
                            Submit Post
                        </Button>
                    </CardFooter>
                </Card>
            </Stack>
        </Flex>
        </Layout>
    );
}
