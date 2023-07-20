import React, { useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Link as ChakraLink, Spacer,
} from '@chakra-ui/react';

const SignInDialog = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Signing in...');
            console.log('Email:', email);
            console.log('Password:', password);
            onClose();
        }, 2000);
    };

    return (
        <>
            <Button colorScheme="red" onClick={onOpen}>
                Sign In
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign In</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter display="flex" justifyContent="flex-start">
                        <ChakraLink>
                            Register here!
                        </ChakraLink>
                        <Spacer />
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleSignIn}
                            isLoading={isLoading}
                            loadingText="Logging In..."
                            spinnerPlacement="end"
                        >
                            {isLoading ? 'Logging In...' : 'Log In'}
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SignInDialog;
