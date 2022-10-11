import React, { useEffect, useState, useRef } from 'react'
import { Authentication } from '../../controllers/authenticaiton';
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { loadingState as atomLoadingState } from '../../state/recoilState';
import { Profile } from '../../controllers/profile';
import { profileState as atomProfileState, selectedArtState as atomSelectedArtState } from "../../state/recoilState";
import { Box, Flex, Progress, Spinner, Wrap, WrapItem, Image, useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Input, Textarea, FormControl, FormLabel, Switch, InputGroup, InputLeftElement, Text, InputRightElement, Spacer, useToast, Tooltip } from '@chakra-ui/react';
import { Art } from '../../controllers/art';
import { useForm } from 'react-hook-form';
import { RiMapPin2Line } from "react-icons/ri"
import axios from 'axios';
import { formatter } from '../../utils/formatters';

const GEOCODE = 'https://maps.googleapis.com/maps/api/geocode/json';
const MAP_API = 'AIzaSyC7g-EssrekE1IDnmsC0K8FkrxBztfpw9w';
const STRIPE_KEY = 'sk_test_51Lize7DbhTM8s4NtDpmRR7iPcppW41EG2AYCHLmJjopgdCnUUP85FQVvmEt98rCnpnr59xQd6zOP7D4kfkMDXqKM00ejfzOuph';


export default function PageCustomerMain() {
    // const stripe = new Stripe(STRIPE_KEY);
    const accountController = new Authentication();
    const profileController = new Profile();
    const artController = new Art();

    const loader = useLoaderData();
    const navigate = useNavigate();
    const navigation = useNavigation();
    const [loadingState, setLoadingState] = useRecoilState(atomLoadingState);
    const [profileState, setProfileState] = useRecoilState(atomProfileState);
    const [arts, setArts] = useState(null);

    const [selectedArt, setSelectedArt] = useRecoilState(atomSelectedArtState);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const editRef = useRef();

    const profileValue = useRecoilValue(atomProfileState);

    const logout = async () => {
        setLoadingState(true);
        await accountController.logout();
        navigate("/", { replace: true });
        setLoadingState(false);
    }

    const getArts = async (accountId) => {
        const coordinates = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(async (position) => {
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

                const response = await artController.getNearbyArts({
                    latitude,
                    longitude
                });

                console.log({ latitude, longitude })
                console.log("getArts() response -> ", response.data);
                setArts(response.data);
            })
            .catch(err => { console.log(err) });



    }


    useEffect(() => {
        if (loader.data === undefined)
            return navigate("/customer/profile/create", { replace: true });
        getArts(loader.data.accountId);
        setProfileState(loader.data);
    }, []);


    return <React.Fragment>

        {navigation.state === "loading" ? Loading() : <></>}

        <Box px={{ base: "5", sm: "20", md: "0", lg: "0", xl: "36" }} pt={20}>
            <Wrap justify={{ base: "center", md: "start", lg: "start" }} spacing={'5'}>
                {arts?.map((value) => {
                    return <WrapItem
                        cursor={"pointer"}
                        onClick={() => {
                            setSelectedArt(value);
                            onOpen();
                        }}

                        key={value._id}>
                        <Tooltip label={value.title} hasArrow>
                            <Box >
                                <Image
                                    src={value.images[0].url}
                                    alt={value.images[0].url}
                                    fit={"cover"}
                                    height={"60"}
                                    width={"80"}
                                    borderRadius={"md"} />
                                <Text color={"gray.600"} mt={2} width={"80"} textOverflow={"ellipsis"} noOfLines={1}>{value.title} </Text>
                                <Text color={"gray.500"} fontSize={"sm"}>{formatter.format(value?.price)}</Text>
                                <Text color={"gray.500"} fontSize={"sm"} lineHeight={1.1}>{value.distanceBetween}</Text>
                            </Box>
                        </Tooltip>
                    </WrapItem>;
                })}

            </Wrap>
        </Box>

        <ModalEdit
            selectedArt={selectedArt}
            editRef={editRef}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose} />
    </React.Fragment>;

    function ModalEdit(props) {
        const { register, setValue, getValues } = useForm();
        const toast = useToast();
        const { editRef, isOpen, onOpen, onClose } = props;
        const selectedArt = useRecoilValue(atomSelectedArtState);
        const [toggleLoading, setToggleLoading] = useState(false);
        const [toggleDeleting, setToggleDeleting] = useState(false);

        useEffect(() => {
            setValue("title", selectedArt?.title);
            setValue("description", selectedArt?.description);
            setValue("price", selectedArt?.price);
        }, [])

        const onDeleteArt = async (id) => {
            setToggleDeleting(true);
            await artController.delete(id);
            await getArts(loader.data.accountId);
            setToggleDeleting(false);
            onClose();
            return toast({
                title: "Artwork deleted successfully!",
                status: 'success',
                position: 'bottom-right'
            });
        }

        const onUpdateArt = async (data) => {
            setToggleLoading(true);
            if (data[0] === "" || data[1] === "" || data[2] === "") return;
            const payload = {
                _id: selectedArt._id,
                title: data[0],
                description: data[1],
                price: data[2],
                availability: true,
            };

            const response = await artController.update(payload);
            if (response.data) {
                setToggleLoading(false);
                setValue("title", data[0]);
                setValue("description", data[1]);
                setValue("price", data[2]);
                onClose();
                await getArts(loader.data.accountId);
                return toast({
                    title: "Updated successfully!",
                    status: "success",
                    position: "bottom-right"
                });
            }
        }


        return <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={editRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            size={"5xl"}  >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>Artwork</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    <Flex flexDirection={{ base: "column", md: "row", lg: "row" }}>
                        <Box width={"full"} mr={"5"}>
                            <Image
                                src={selectedArt?.images?.[0]["url"]}
                                fit={"cover"} borderRadius={"md"}
                                height={{ base: null, md: "500px", lg: "500px" }} />
                        </Box>
                        <Box mt={{ base: "5", md: "0", lg: "0" }} width={{ base: "full", md: "60%", lg: "60%" }}>
                            <Text fontSize={"2xl"}>{selectedArt?.title}</Text>
                            <Text>{selectedArt?.description}</Text>
                            <Text mt={5}>{formatter.format(selectedArt?.price)}</Text>
                        </Box>
                    </Flex>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        onClick={onClose}
                        type={"button"}>
                        Cancel
                    </Button>
                    <Button
                        background={"pink.400"}
                        color={"white"}
                        ml={3}
                        onClick={() => onUpdateArt(getValues(["title", "description", "price"]))}
                        isLoading={toggleLoading}>
                        Buy Now
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    }

    function Loading() {
        return <Progress size='xs' isIndeterminate colorScheme={"pink"} />;
    }
}
