import { UserContextProvider } from '@/context/userContext';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@/layout';

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <UserContextProvider>
                    <Component {...pageProps} />
            </UserContextProvider>
        </ChakraProvider>
    );
}

export default MyApp;
