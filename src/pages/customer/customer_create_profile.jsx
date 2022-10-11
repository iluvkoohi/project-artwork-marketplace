import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, FormControl, FormHelperText, Image, Input, SimpleGrid, Text, Textarea, useColorModeValue, useToast, } from '@chakra-ui/react'
import { RepeatIcon, CheckCircleIcon } from "@chakra-ui/icons"
import { useNavigate } from 'react-router-dom';
import { Authentication } from '../../controllers/authenticaiton';
import { Profile } from '../../controllers/profile';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountState, loadingState } from '../../state/recoilState';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import FilePicker from 'chakra-ui-file-picker';
import { Ticket } from '../../controllers/ticket';
import NavbarInCustomerEditProfile from './customer_components/navbar_edit_profile';


const GEOCODE = 'https://maps.googleapis.com/maps/api/geocode/json';
const MAP_API = 'AIzaSyC7g-EssrekE1IDnmsC0K8FkrxBztfpw9w';

function PageCustomerCreateProfile() {
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm();

    const navigate = useNavigate();
    const validIdentifierRef = useRef(null);
    const toast = useToast();
    const [locationCoordinates, setLocationCoordinates] = useState();
    const [validIdentifier, setValidIdentifier] = useState({
        name: "UPLOAD VALID ID",
        file: null
    });
    const [loading, setLoading] = useRecoilState(loadingState);
    const account = useRecoilValue(accountState);

    const ticketController = new Ticket();
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
            toast({
                title: "Profile created successfully!",
                status: 'success',
                position: 'bottom-right'
            });

            return navigate("/customer/main", { replace: true });

        }
        return toast({
            title: "Something went wrong while creating your profile",
            status: 'error',
            position: 'bottom-right'
        });
    };

    const onAddValidIdentifier = (event) => {
        if (event.target.files && event.target.files[0]) {
            setValidIdentifier(prev => ({
                ...prev,
                name: event.target.files[0].name,
                file: event.target.files[0]
            }));
        }
    }
    const syncCurrentLocation = async () => {
        const coordinates = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                setLocationCoordinates({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                if (position) {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }
            })
        });
        await coordinates
            .then(async value => {
                const { latitude, longitude } = value;
                const { data: { results } } = await axios.get(`${GEOCODE}?latlng=${latitude},${longitude}&key=${MAP_API}`);
                setLocationCoordinates({
                    latitude: value.latitude,
                    longitude: value.longitude
                });

                for (let address of results) {
                    if (!address.formatted_address.includes("+")) {
                        setValue("address", address.formatted_address);
                        setValue("email", account?.data?.email);
                        console.log(address);
                        break;
                    }
                }
            })
            .catch(err => { console.log(err) });
    }

    useEffect(() => {
        setLoading(true);
        syncCurrentLocation();
        setLoading(false);
        window.document.title = "Create Profile | Artwork Marketplace"
    }, [])

    return <>
        <NavbarInCustomerEditProfile
            logout={() => logout()}
            title={"Artwork Marketplace"} />

        <Flex justify={"center"} px={"10"} >
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                <Box mt={"14"}>
                    <Text mb={"5"} fontWeight={"bold"} color={"gray.400"}>Basic info</Text>
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

                <Box mt={"10"}>
                    <Text mb={"5"} fontWeight={"bold"} color={"gray.400"}>Tell people when you were born</Text>
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
                </Box>

                <Box mt={"10"}  >
                    <Text mb={"5"} fontWeight={"bold"} color={"gray.400"}>How people find and contact you</Text>
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
                            mb={"3"}
                            disabled />
                        <Input
                            type={"number"}
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

                </Box>

                <Box mt={"10"} >
                    <Text mb={"5"} fontWeight={"bold"} color={"gray.400"}>Address</Text>
                    <Textarea
                        isInvalid={errors.address}
                        {...register("address", {
                            required: {
                                value: true,
                                message: "Address is required"
                            }
                        })}
                        placeholder='Home Address'
                        size='md'
                        mb={"3"}
                        defaultValue={"Address"}
                        disabled></Textarea>
                </Box>

                <Flex justifyContent={"end"}>
                    <Button
                        type={"submit"}
                        isLoading={isSubmitting}
                        loadingText='Creating Profile'
                        leftIcon={<CheckCircleIcon />}
                        background={useColorModeValue("pink.400", "pink.400")}
                        variant='solid'
                        mt={"5"}
                        color={"white"}>
                        Create Profile
                    </Button>
                </Flex>
            </form>
        </Flex>
    </>
}

export default PageCustomerCreateProfile