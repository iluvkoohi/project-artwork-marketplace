import React, { useEffect, useState, useRef } from 'react'
import { Authentication } from '../../controllers/authenticaiton';
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import NavbarArtist from './artist_components/navbar';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loadingState as atomLoadingState } from '../../state/recoilState';
import { Profile } from '../../controllers/profile';
import { profileState as atomProfileState, selectedArtState as atomSelectedArtState } from "../../state/recoilState";
import { Box, Flex, Progress, Spinner, Wrap, WrapItem, Image, useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Input, Textarea, FormControl, FormLabel, Switch, InputGroup, InputLeftElement, Text, InputRightElement, Spacer, useToast } from '@chakra-ui/react';
import { Art } from '../../controllers/art';
import { useForm } from 'react-hook-form';

export default function PageArtistMain() {
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
        const response = await artController.getByArtists({ accountId });
        console.log("getArts() response -> ", response.data);
        setArts(response.data);
    }


    useEffect(() => {
        if (loader.data === undefined)
            return navigate("/artist/profile/create", { replace: true });
        getArts(loader.data.accountId);
        setProfileState(loader.data);
    }, []);


    return <React.Fragment>
        <NavbarArtist
            title={"Artworks"}
            logout={() => logout()} />
        {navigation.state === "loading" ? Loading() : <></>}

        <Box px={{ base: "5", sm: "20", md: "0", lg: "0", xl: "36" }} pt={20}>
            <Wrap justify={{ base: "center", md: "start", lg: "start" }}>
                {arts?.map((value) => {
                    return <WrapItem
                        cursor={"pointer"}
                        onClick={() => {
                            setSelectedArt(value);
                            onOpen();
                        }}
                        key={value._id}>
                        <Box >
                            <Image
                                src={value.images[0].url}
                                alt={value.images[0].url}
                                fit={"cover"}
                                height={"60"}
                                width={"80"}
                                borderRadius={"md"} />
                        </Box>
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
                            <Input
                                placeholder='Write title...'
                                {...register("title", { required: true })} />
                            <InputGroup mt={"2"}>
                                <InputLeftElement
                                    maxLength={"3"}
                                    pointerEvents='none'
                                    children={<Text>₱</Text>} />
                                <Input
                                    type={"number"}
                                    placeholder={"Price"}
                                    {...register("price", { required: true })} />
                                <InputRightElement children={<Text>.00</Text>} />
                            </InputGroup>
                            <Textarea
                                mt={"2"}
                                placeholder='Say something about this art...'
                                rows={"10"}
                                {...register("description", { required: true })}></Textarea>

                            {/* <FormControl display='flex' alignItems='center' mt={"5"} ml={2}>
                                <FormLabel htmlFor='email-alerts' mb='0' fontWeight={"normal"}>
                                    Artwork Visibility
                                </FormLabel>
                                <Switch id='email-alerts' isChecked={selectedArt?.availability} />
                            </FormControl> */}
                        </Box>
                    </Flex>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        color={"red"}
                        onClick={() => onDeleteArt(selectedArt?._id)}
                        isLoading={toggleDeleting}>
                        Delete
                    </Button>
                    <Spacer />
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
                        Save changes
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    }

    function Loading() {
        return <Progress size='xs' isIndeterminate colorScheme={"pink"} />;
    }
}
