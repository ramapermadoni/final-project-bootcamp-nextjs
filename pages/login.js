import { Button, Card, CardBody, CardFooter, CardHeader, Flex, FormControl, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react"
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
export default function Login() {
    const router = useRouter();
    const toast = useToast();
    const { mutate } = useMutation();
    const [payload, setPayload] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false); // State untuk loading

    const HandleSubmit = async () => {
        setIsLoading(true); // Aktifkan loading
        try {
            const response = await mutate({ url: "/api/login", payload });
            if (!response?.success) {
                toast({
                    title: "Login Gagal",
                    description: "Email atau password salah",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                });
            } else {
                Cookies.set("user_token", response?.data?.token, { expires: new Date(response?.data?.expires_at), path: '/' });
                router.push('/');
            }
        } catch (error) {
            toast({
                title: "Terjadi Kesalahan",
                description: "Silakan coba lagi.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
        } finally {
            setIsLoading(false); // Matikan loading setelah selesai
        }
    };
    return (
        <Flex alignItems="center" justifyContent="center" h="100vh" bg="gray.50">
            <Stack direction="column" spacing={8} maxW="400px" w="100%">
                <Card boxShadow="lg" borderRadius="md" bg="white">
                    <CardHeader>
                        <Heading as="h4" size="lg" textAlign="center">
                            Login
                        </Heading>
                    </CardHeader>
                    <CardBody>
                        <Stack spacing={4}>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Email"
                                    value={payload.email}
                                    onChange={(event) => setPayload({ ...payload, email: event.target.value })}
                                    focusBorderColor="teal.400"
                                />
                            </FormControl>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={payload.password}
                                    onChange={(event) => setPayload({ ...payload, password: event.target.value })}
                                    focusBorderColor="teal.400"
                                />
                            </FormControl>
                        </Stack>
                    </CardBody>
                    <CardFooter flexDirection="column" gap={4}>
                        <Button
                            w="100%"
                            colorScheme="teal"
                            isLoading={isLoading}
                            onClick={() => HandleSubmit()}
                        >
                            Login
                        </Button>
                        <Text textAlign="center">
                            Belum punya akun?{" "}
                            <Text
                                as="span"
                                color="teal.500"
                                cursor="pointer"
                                onClick={() => router.push('/register')}
                            >
                                Register
                            </Text>
                        </Text>
                    </CardFooter>
                </Card>
            </Stack>
        </Flex>
    );

}