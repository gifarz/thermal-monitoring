'use client'

import React from 'react'
import { Button, Card, CardHeader, CardBody, Image, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from "@nextui-org/react";
import { EyeSlashFilledIcon } from './EyeSlashFilledIcon';
import { EyeFilledIcon } from './EyeFilledIcon';
import { decryptData, encryptData } from '@/utils/encryptDecrypt';
import { getTime, format, addDays, addHours } from 'date-fns';
import { usePathname } from 'next/navigation';

export default function LoginComp(props) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginKey, setLoginKey] = React.useState('');
    const [responseData, setResponseData] = React.useState(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isExpired, setIsExpired] = React.useState(null);
    const [isLogout, setIsLogout] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const pathName = usePathname();

    React.useEffect(() => {

        const handleSecret = async () => {
            const secretKeyResponse = await fetch("/api/general/fetchSecretKeyByName");
            const resSecretKey = await secretKeyResponse.json();

            return resSecretKey.data[0]?.key;
        };

        const fetchAndDecryptData = async () => {
            try {
                const secretKey = await handleSecret();
                setLoginKey(secretKey)

                const loginSecretCode = localStorage.getItem('loginSecretCode');

                if (loginSecretCode) {

                    const decryption = decryptData(loginSecretCode, secretKey);

                    const decryptDate = new Date(decryption);
                    const newDecryptDate = addDays(decryptDate, 1); // Add day
                    // const newDecryptDate = addHours(decryptDate, 3); // Add hour
                    const formattedDecryptDate = format(newDecryptDate, 'yyyy-MM-dd HH:mm:ss')

                    const currDate = new Date();
                    const formattedCurrDate = format(currDate, 'yyyy-MM-dd HH:mm:ss')

                    if (formattedDecryptDate < formattedCurrDate) {
                        setIsExpired(true)

                        localStorage.removeItem('loginSecretCode')
                    } else {
                        setIsExpired(false)
                        setIsLogout(false)
                    }

                } else {
                    setIsExpired(true)
                }

            } catch (error) {
                console.error("Error fetching or decrypting data:", error);
            }
        };

        fetchAndDecryptData();

    }, [responseData])

    const handleLogin = async () => {

        setIsLoading(true)

        // Get the current date as epoch time (in milliseconds)
        const epochTime = getTime(new Date());

        try {
            const res = await fetch('/api/general/fetchUserByUsername', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                throw new Error('Failed to fetch user data');
            }

            const response = await res.json();

            if (response.resultCode == '0') {

                setResponseData('Login Success')

                const encryption = encryptData(epochTime, loginKey)

                localStorage.setItem('loginSecretCode', encryption)

                setUsername(null)
                setPassword(null)

            } else {
                setResponseData(response.resultDesc)
                setIsOpen(true)
            }

            setIsLoading(false)

        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('loginSecretCode')
        setResponseData('Logout')
    }

    return (
        <>
            <div
                style={{
                    display: isExpired == false ? 'none' : ''
                }}
                className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50'
            >
                {
                    isExpired == null ?
                        <p className='text-white font-bold'>Checking Eligibility...</p>
                        :
                        isExpired ?
                            <Card fullWidth="true" className='py-5 px-7 w-1/2 lg:w-1/3'>
                                <CardHeader className="flex-col">
                                    <p className='font-semibold text-center'>Welcome to Thermal Monitoring Dashboard</p>
                                    <p className='mt-4 text-sm text-center'>Please fill the username and password</p>
                                </CardHeader>
                                <CardBody className="overflow-visible py-2">
                                    <Input
                                        fullWidth="true"
                                        type="username"
                                        variant="underlined"
                                        label="Input Username"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <Input
                                        fullWidth="true"
                                        label="Input Password"
                                        variant="underlined"
                                        endContent={
                                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                                {isVisible ? (
                                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                ) : (
                                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                                )}
                                            </button>
                                        }
                                        type={isVisible ? "text" : "password"}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </CardBody>
                                <Button
                                    fullWidth="true"
                                    color="primary"
                                    variant="shadow"
                                    className="mt-5"
                                    size='md'
                                    onClick={handleLogin}
                                    isDisabled={isLoading}
                                >
                                    {
                                        isLoading ?
                                            <Spinner color="default" />
                                            :
                                            <p>Sign In</p>
                                    }
                                </Button>
                            </Card>
                            :
                            <></>
                }
            </div>

            <div
                style={{ 
                    display: isExpired == false && pathName == '/' ? '' : 'none',
                    top: props.canvasHeight * 0.125,
                    right: props.canvasWidth * 0.02,
                    fontSize: props.canvasWidth * 0.01,
                }}
                className='absolute z-20'>
                <Button radius='full' size='lg' color='danger' onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            {/* MODAL RESPONSE */}
            <Modal
                isOpen={isOpen}
                placement="top"
                onOpenChange={(open) => setIsOpen(open)}
                size='xs'
                backdrop='blur'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Sign In</ModalHeader>
                            <ModalBody>
                                <p>
                                    {responseData}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
