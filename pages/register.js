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
    Input,
    Stack,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useMutation } from "@/hooks/useMutation";
  import { useRouter } from "next/router";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  
  export default function Register() {
    const router = useRouter();
    const toast = useToast();
    const { mutate } = useMutation();
    const [payload, setPayload] = useState({
      name: "",
      email: "",
      password: "",
      dob: null,
      phone: "",
      hobby: "",
    });
    const [errors, setErrors] = useState({}); // Untuk menyimpan pesan error
  
    const validate = () => {
      const newErrors = {};
      if (!payload.name) newErrors.name = "Nama harus diisi.";
      if (!payload.email) newErrors.email = "Email harus diisi.";
      if (!payload.password) newErrors.password = "Password harus diisi.";
      if (!payload.dob) newErrors.dob = "Tanggal lahir harus diisi.";
      if (!payload.phone) newErrors.phone = "Nomor telepon harus diisi.";
      if (!payload.hobby) newErrors.hobby = "Hobi harus diisi.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0; // Jika tidak ada error, validasi berhasil
    };
  
    const HandleSubmit = async () => {
      if (!validate()) return; // Validasi sebelum submit

  // Konversi `dob` ke string dengan format yyyy-mm-dd
  const formattedPayload = {
    ...payload,
    dob: payload.dob ? payload.dob.toISOString().split("T")[0] : null, // Format yyyy-mm-dd
  };
      console.log("payload => ", formattedPayload);
      const response = await mutate({ url: "/api/register", payload: formattedPayload });
    //   const response = await mutate({ url: "/api/register", payload });
      if (!response?.success) {
        toast({
          title: "Register Gagal",
          description: "Silakan periksa data Anda",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Register Berhasil",
          description: "Anda berhasil mendaftar",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        router.push("/login");
      }
    };
  
    return (
      <Flex alignItems="center" justifyContent="center" h="100vh" bg="gray.50">
        <Stack direction="column" spacing={8} maxW="400px" w="100%">
          <Card boxShadow="lg" borderRadius="md" bg="white">
            <CardHeader>
              <Heading as="h4" size="lg" textAlign="center">
                Register
              </Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <Input
                    type="text"
                    placeholder="Nama"
                    value={payload.name}
                    onChange={(event) =>
                      setPayload({ ...payload, name: event.target.value })
                    }
                    focusBorderColor="teal.400"
                  />
                  {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!errors.email}>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={payload.email}
                    onChange={(event) =>
                      setPayload({ ...payload, email: event.target.value })
                    }
                    focusBorderColor="teal.400"
                  />
                  {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={payload.password}
                    onChange={(event) =>
                      setPayload({ ...payload, password: event.target.value })
                    }
                    focusBorderColor="teal.400"
                  />
                  {errors.password && (
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.dob}>
                <Flex align="center">
                    <DatePicker
                    selected={payload.dob}
                    onChange={(date) => setPayload({ ...payload, dob: date })}
                    dateFormat="dd-MM-yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Tanggal Lahir"
                    customInput={
                        <Input
                        focusBorderColor={errors.dob ? "red.400" : "teal.400"}
                        bg="white"
                        borderColor={errors.dob ? "red.400" : "gray.200"}
                        _hover={{ borderColor: errors.dob ? "red.400" : "gray.300" }}
                        _focus={{
                            boxShadow: errors.dob ? "0 0 0 1px red" : "0 0 0 1px teal.400",
                        }}
                        />
                    }
                    />
                    <Flex ml={2} color="gray.500">
                    {/* Ikon tanggal */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        width={24}
                        height={24}
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 2.25v1.5m7.5-1.5v1.5m-11.25 3h15M3.75 6.75h16.5c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.75c-.621 0-1.125-.504-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125z"
                        />
                    </svg>
                    </Flex>
                </Flex>
                {errors.dob && <FormErrorMessage>{errors.dob}</FormErrorMessage>}
                </FormControl>

                
                <FormControl isInvalid={!!errors.phone}>
                  <Input
                    type="text"
                    placeholder="Nomor Telepon"
                    value={payload.phone}
                    onChange={(event) =>
                      setPayload({ ...payload, phone: event.target.value })
                    }
                    focusBorderColor="teal.400"
                  />
                  {errors.phone && (
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.hobby}>
                  <Input
                    type="text"
                    placeholder="Hobi"
                    value={payload.hobby}
                    onChange={(event) =>
                      setPayload({ ...payload, hobby: event.target.value })
                    }
                    focusBorderColor="teal.400"
                  />
                  {errors.hobby && (
                    <FormErrorMessage>{errors.hobby}</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
            </CardBody>
            <CardFooter flexDirection="column" gap={4}>
              <Button
                w="100%"
                colorScheme="teal"
                onClick={() => HandleSubmit()}
              >
                Register
              </Button>
              <Text textAlign="center">
                Sudah punya akun?{" "}
                <Text
                  as="span"
                  color="teal.500"
                  cursor="pointer"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Text>
              </Text>
            </CardFooter>
          </Card>
        </Stack>
      </Flex>
    );
  }
  