import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, FormControl, FormHelperText, Image, Input, SimpleGrid, Text, useToast, WrapItem } from '@chakra-ui/react'
import { RepeatIcon, CheckCircleIcon } from "@chakra-ui/icons"
import NavbarInEditProfile from './artist_components/navbar_edit_profile'
import { useNavigate } from 'react-router-dom';
import { Authentication } from '../../controllers/authenticaiton';
import { Profile } from '../../controllers/profile';
import { useRecoilState } from 'recoil';
import { loadingState } from '../../state/recoilState';
import { useForm } from 'react-hook-form';



function PageEditProfile() {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const toast = useToast()
    const [locationCoordinates, setLocationCoordinates] = useState();
    const [loading, setLoading] = useRecoilState(loadingState);

    const accountController = new Authentication();
    const profileController = new Profile();

    const logout = async () => {
        setLoading(true);
        await accountController.logout();
        navigate("/", { replace: true });
        setLoading(false);
    }

    const onSubmit = async (data) => {
        if (locationCoordinates === undefined) {
            return toast({
                title: "Please allow Location Permission and Refresh the page",
                status: 'error',
                position: 'bottom-right'
            });
        }
        const { firstName, lastName, email, number, address, birthdate } = data;
        let payload = {
            "name": { "first": firstName, "last": lastName },
            birthdate,
            "address": { "name": address, "coordinates": { ...locationCoordinates } },
            "contact": { "email": email, "number": number },
            "account": { "role": "artist" }
        }

        const response = await profileController.create(payload);

        if (response.data) {
            return toast({
                title: "Profile updated successfully!",
                status: 'success',
                position: 'bottom-right'
            });
        }
        return toast({
            title: "Something went wrong while updating your profile",
            status: 'error',
            position: 'bottom-right'
        });
    };


    const syncCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLocationCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });

        });

    }

    useEffect(() => {
        syncCurrentLocation();
        return () => {

        }
    }, [])



    return <>
        <NavbarInEditProfile
            logout={() => logout()}
            title={"Artwork Marketplace"} />

        <Box mt={"10"}>
            <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} pr={"5"} gap={2}>
                <Box></Box>
                <Box px={"10"}>
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Flex alignItems={"center"} mt={"10"}>
                            <Box mt={"4"}>
                                <Input
                                    {...register("firstName", {
                                        required: {
                                            value: true,
                                            message: "First name is required"
                                        }
                                    })}
                                    isInvalid={errors.firstName}
                                    placeholder='First name'
                                    size='md'
                                    mb={"3"} />
                                <Input
                                    isInvalid={errors.lastName}
                                    {...register("lastName", {
                                        required: {
                                            value: true,
                                            message: "Last name is required"
                                        }
                                    })}
                                    placeholder='Last name'
                                    size='md'
                                    mb={"3"} />
                            </Box>
                            <Box width={"10"}></Box>
                            <Image
                                borderRadius='full'
                                boxSize='100px'
                                src='https://bit.ly/dan-abramov'
                                alt='Dan Abramov'
                            />
                        </Flex>
                        <Text mt={"10"} mb={"5"} fontWeight={"bold"} color={"gray.400"}>Tell people when you were born</Text>

                        <Input
                            {...register("birthdate", {
                                required: {
                                    value: true,
                                    message: "Birthdate is required"
                                }
                            })}
                            placeholder="Select Date and Time"
                            size="md"
                            type="date" />

                        <Text mt={"10"} mb={"5"} fontWeight={"bold"} color={"gray.400"}>How people find and contact you</Text>
                        <FormControl mb={"3"}>
                            <Input
                                isInvalid={errors.email}
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email is required"
                                    }
                                })}

                                placeholder='Email'
                                size='md'
                                mb={"3"} />
                            <Input
                                isInvalid={errors.number}
                                {...register("number", {
                                    required: {
                                        value: true,
                                        message: "Contact Number is required"
                                    }
                                })}
                                placeholder='Number'
                                size='md' />

                            <FormHelperText>We'll never share your email and contact number.</FormHelperText>
                        </FormControl>



                        <Text mt={"10"} mb={"5"} fontWeight={"bold"} color={"gray.400"}>Location</Text>
                        <Input
                            isInvalid={errors.address}
                            {...register("address", {
                                required: {
                                    value: true,
                                    message: "Address is required"
                                }
                            })}
                            placeholder='Home Address'
                            size='md'
                            mb={"3"} />

                        <Flex justifyContent={"end"}>
                            <Button
                                type={"submit"}
                                isLoading={isSubmitting}
                                loadingText='Saving Changes'
                                leftIcon={<CheckCircleIcon />}
                                colorScheme='pink'
                                variant='solid'
                                mt={"5"}
                                color={"white"}>
                                Save Changes
                            </Button>
                        </Flex>
                    </form>
                </Box>

                <Box></Box>
            </SimpleGrid>
        </Box>
    </>
}

export default PageEditProfile