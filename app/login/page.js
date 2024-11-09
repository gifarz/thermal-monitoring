'use client'

import React from 'react'
import { Button, Card, CardHeader, CardBody, Image, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, } from "@nextui-org/react";
import { EyeSlashFilledIcon } from '../../components/EyeSlashFilledIcon';
import { EyeFilledIcon } from '../../components/EyeFilledIcon';

export default function page() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userData, setUserData] = React.useState(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleLogin = async () => {

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

            const data = await res.json();

            if(data.resultCode == '0'){
                setUserData('Login Success')

            } else {
                setUserData(data.resultDesc)
            }

            setIsOpen(true)

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className='flex items-center justify-center h-screen'>
                <Card fullWidth="true" className='p-10 w-1/3'>
                    <CardHeader className="flex-col">
                        <p>Welcome To Thermal Monitoring Dashboard</p>
                        <p className='mt-5 text-sm'>Please fill in your username and password to enter the dashboard</p>
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
                    >
                        Sign In
                    </Button>
                </Card>

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
                                    {userData}
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
