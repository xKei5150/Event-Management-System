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
    Link as ChakraLink,
    Spacer, InputLeftElement, InputGroup,
} from '@chakra-ui/react';
import { FaUser, FaKey } from 'react-icons/fa';

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
            <Button variant="primary" onClick={onOpen}>
                SIGN IN
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader borderBottom="3px solid #800000" color="#800000" fontWeight="bold">
                        SIGN IN
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none"
                                                  borderRight="1px solid #800000"
                                                  px={2}
                                                  ml={2}>
                                    <FaUser color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    ml = {2}
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none"
                                                  borderRight="1px solid #800000"
                                                  px={2}
                                                  ml={2}>
                                    <FaKey color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    ml = {2}
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </InputGroup>
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
                            variant = "primary"
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
