import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Divider, Flex, FormControl, FormHelperText, Heading, Image, Input, Progress, SimpleGrid, Spinner, Text, useColorMode, useToast, } from '@chakra-ui/react'
import { RepeatIcon, CheckCircleIcon } from "@chakra-ui/icons"
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { Authentication } from '../../controllers/authenticaiton';
import { Profile } from '../../controllers/profile';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loadingState } from '../../state/recoilState';
import { useForm } from 'react-hook-form';
import { profileState as atomProfileState } from '../../state/recoilState';
import NavbarArtist from './artist_components/navbar';
import dayJs from "dayjs";
import emptyAvatar from "../../images/empty-avatar.jpg";
import imageCompression from 'browser-image-compression';
import { BiUser, BiCog, BiPaint, BiShieldAlt2, BiCreditCardAlt } from "react-icons/bi"
import axios from 'axios';
import ProgressLine from '../../components/progressbar';

function PageUpdateProfile() {
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm();
    const [profileState, setProfileState] = useRecoilState(atomProfileState);
    const profileValue = useRecoilValue(atomProfileState);
    const { name, contact, birthdate, address } = profileValue;

    const navigate = useNavigate();
    const navigation = useNavigation();

    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();

    const [locationCoordinates, setLocationCoordinates] = useState(null);
    const [loading, setLoading] = useRecoilState(loadingState);
    const [avatarImage, setAvatarImage] = useState(null);
    const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);

    const avatarImageRef = useRef(null);


    const accountController = new Authentication();
    const profileController = new Profile();

    const logout = async () => {
        setLoading(true);
        await accountController.logout();
        navigate("/", { replace: true });
        setLoading(false);
    }

    const onSubmit = async (data) => {
        const { firstName, lastName, email, number, address, birthdate } = data;
        const parsedBirthdate = new Date(birthdate);

        if (locationCoordinates === undefined) {
            return toast({
                title: "Please allow Location Permission and Refresh the page",
                status: 'error',
                position: 'bottom-right'
            });
        }
        let payload = {
            "name": { "first": firstName, "last": lastName },
            birthdate: parsedBirthdate.toISOString(),
            "address": { "name": address, "coordinates": { ...locationCoordinates } },
            "contact": { "email": email, "number": number },
            "account": { "role": "artist" }
        }

        console.log("payload -> ", payload)

        setProfileState((prev) => ({
            ...prev,
            ...payload
        }))

        const response = await profileController.update(payload);
        if (response.data) {
            console.log("response -> ", response.data)

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

    const onUploadAvatar = async (event) => {

        if (event.target.files && event.target.files[0]) {
            setAvatarImage(URL.createObjectURL(event.target.files[0]));

            const formData = new FormData();
            const imageFile = event.target.files[0];
            const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            });
            formData.append("images", compressedFile)

            const response = await axios.put(process.env.REACT_APP_BASE_URL + "/api/profile/avatar",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                    onUploadProgress: (progressEvent) => {
                        const value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setAvatarUploadProgress(value);
                        console.log(`Upload: ${value}%`)
                    }
                });

            if (response.data) {
                setAvatarUploadProgress(0);
                setProfileState(response.data);
                return toast({
                    title: "Profile avatar updated successfully!",
                    status: 'success',
                    position: 'bottom-right'
                });
            }
            return toast({
                title: "Something went wrong while updating your profile avatar",
                status: 'error',
                position: 'bottom-right'
            });
        }
    }

    const syncCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLocationCoordinates({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    }

    const getProfile = async () => {
        const formattedBirthDate = dayJs(birthdate).format("YYYY-MM-DD");
        setValue('firstName', name.first, { shouldValidate: true })
        setValue('lastName', name.last, { shouldValidate: true })
        setValue('birthdate', formattedBirthDate, { shouldValidate: true })
        setValue('email', contact.email, { shouldValidate: true })
        setValue('number', contact.number, { shouldValidate: true })
        setValue('address', address.name, { shouldValidate: true });

        window.document.title = `${name.first + " " + name.last} | Artwork Marketplace `
    }

    useEffect(() => {
        syncCurrentLocation();
        getProfile();
    }, [])

    return <React.Fragment>
        <NavbarArtist
            title={`Welcome Back, ${profileValue?.name.first}!`}
            logout={() => logout()} />
        {avatarUploadProgress !== 0 && <ProgressLine
            visualParts={[{ percentage: `${avatarUploadProgress}%`, color: "#D53F8C" }]} />}
        {!locationCoordinates || navigation.state === "loading" ? Loading() :
            <Flex justify={"center"} flexDirection={{ base: "column", md: "row", lg: "row" }} px={"10"} mt={"14"}>
                <Flex flexDirection={"column"} alignContent={"center"} >
                    <Flex>
                        <Image
                            borderRadius='full'
                            boxSize='60px'
                            src={profileValue.avatar ? profileValue.avatar : emptyAvatar}
                            alt="small_avatar" />
                        <Box width={"5"}></Box>
                        <Box>
                            <Text fontWeight={"medium"} color={"gray.500"} fontSize={"2xl"}>{name.first} {name.last}</Text>
                            <Text fontWeight={"normal"} color={"gray.400"} lineHeight={"1"}>Your personal account</Text>
                        </Box>
                    </Flex>
                    <Divider my={"10"} />
                    <Box>
                        <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.400"}>User</Text>
                        <Box my={"5"}> </Box>
                        <Flex mb={"3"}>
                            <BiUser color={"gray"} />
                            <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Public profile</Text>
                        </Flex>
                        <Flex mb={"3"}>
                            <BiCog color={"gray"} />
                            <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Account</Text>
                        </Flex>
                        <Flex>
                            <BiPaint color={"gray"} />
                            <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Appearance</Text>
                        </Flex>
                    </Box>
                    <Divider my={"10"} />
                    <Box>
                        <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.400"}>Access</Text>
                        <Box my={"5"}> </Box>
                        <Flex mb={"3"}>
                            <BiCreditCardAlt color={"gray"} />
                            <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Billings and transactions</Text>
                        </Flex>
                        <Flex mb={"3"}>
                            <BiShieldAlt2 color={"gray"} />
                            <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Password and authentication</Text>
                        </Flex>

                    </Box>
                </Flex>
                <Box width={"20"} height={{ base: "24", md: "0", lg: "0" }}></Box>
                <Box>
                    <Heading size={"lg"} color={"gray.400"}>Public profile</Heading>
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <Flex alignItems={"center"} mt={"10"}>
                            <Box mt={"4"}>
                                <Input
                                    isInvalid={errors.firstName}
                                    {...register("firstName", {
                                        required: {
                                            value: true,
                                            message: "First name is required"
                                        }
                                    })}
                                    placeholder='First name'
                                    size='md'
                                    maxLength={"20"}
                                    mb={"3"} />
                                <Input
                                    isInvalid={errors.lastName}
                                    {...register("lastName", {
                                        required: {
                                            value: true,
                                            message: "Last name is required"
                                        }
                                    })}
                                    maxLength={"20"}
                                    placeholder='Last name'
                                    size='md'
                                    mb={"3"} />
                            </Box>
                            <Box width={"10"}></Box>
                            <input
                                type="file"
                                id="avatarImageId"
                                ref={avatarImageRef}
                                accept="image/png, image/jpeg"
                                hidden
                                onChange={onUploadAvatar} />
                            {avatarImage ? <label htmlFor={"avatarImageId"} cursor={"pointer"}  >
                                <Image
                                    src={avatarImage}
                                    borderRadius='full'
                                    boxSize='100px' objectFit='cover'
                                    alt="Preview image"
                                    cursor={"pointer"}
                                    shadow={colorMode === "light" ? "2xl" : "dark-lg"} />
                            </label> : <label htmlFor={"avatarImageId"}>
                                <Image
                                    src={profileValue.avatar ? profileValue.avatar : emptyAvatar}
                                    borderRadius='full'
                                    boxSize='100px' objectFit='cover'
                                    alt="Preview image"
                                    cursor={"pointer"}
                                    shadow={colorMode === "light" ? "2xl" : "dark-lg"} />

                            </label>}


                        </Flex>
                        <Text mt={"14"} mb={"5"} fontWeight={"bold"} color={"gray.400"}>Tell people when you were born</Text>
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

                        <Text mt={"14"} mb={"5"} fontWeight={"bold"} color={"gray.400"}>How people find and contact you</Text>
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

                        <Text mt={"14"} mb={"5"} fontWeight={"bold"} color={"gray.400"}>Location</Text>
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
            </Flex>}
    </React.Fragment>;

    function Loading() {
        return <Progress size='xs' isIndeterminate colorScheme={"pink"} />;
    }
}

export default PageUpdateProfile