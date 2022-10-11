import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Box, Button, Divider, Flex, Heading, Icon, Image, Input, InputGroup, InputLeftElement, InputRightElement, Progress, Skeleton, Text, Textarea, useColorMode, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Authentication } from '../../controllers/authenticaiton';
import { profileState as atomProfileState } from "../../state/recoilState";
import { loadingState as atomLoadingState } from '../../state/recoilState';
import NavbarArtist from './artist_components/navbar';
import { BiCloudUpload, BiCog, BiCreditCardAlt, BiPaint, BiShieldAlt2, BiTime, BiTrash, BiUser, BiX } from "react-icons/bi"
import { IoLogoUsd } from "react-icons/io";
import imgUploadArtSample from "../../images/upload-image.png";
import emptyAvatar from "../../images/empty-avatar.jpg";
import { useForm } from 'react-hook-form';
import { Art } from '../../controllers/art';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import ProgressLine from '../../components/progressbar';
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime';

function PageArtistArtwork() {
    const accountController = new Authentication();
    const artController = new Art();

    const { register, handleSubmit, watch, setValue, getValues, formState: { errors, isSubmitting } } = useForm();

    const profileValue = useRecoilValue(atomProfileState);
    const [loadingState, setLoadingState] = useRecoilState(atomLoadingState);

    const navigate = useNavigate();
    const navigation = useNavigation();

    const [artworkImage, setArtworkImage] = useState(null);
    const [artworkImageFile, setArtworkImageFile] = useState(null)
    const [artworkUploadProgress, setArtworkUploadProgress] = useState(0)
    const [locationCoordinates, setLocationCoordinates] = useState(null);
    const [selectedArt, setSelectedArt] = useState(null);
    const [toggleLoading, setToggleLoading] = useState(false);
    const [toggleDeleting, setToggleDeleting] = useState(false);
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();
    const artImage = useRef(null);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    const useBorder = useColorModeValue("gray.200", "gray.700");

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setArtworkImageFile(event.target.files[0]);
            setArtworkImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    const onCreateArt = async (data) => {
        if (!artworkImageFile) {
            artImage.current.click();
            return toast({
                title: "Please select your own Artwork by clicking the existing Image",
                status: 'error',
                position: 'bottom-right'
            });
        }
        const { title, description, price } = data;
        const formData = new FormData();
        const imageFile = artworkImageFile;

        const compressedFile = await imageCompression(imageFile, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        });


        formData.append("images", compressedFile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", parseInt(price));

        const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/art",
            formData,
            {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                onUploadProgress: (progressEvent) => {
                    const value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setArtworkUploadProgress(value);
                    console.log(`Upload: ${value}%`)
                }
            });
        console.log(response.data);
        if (response.data) {
            setArtworkUploadProgress(0);
            return toast({
                title: "Artwork posted successfully!",
                status: 'success',
                position: 'bottom-right'
            });
        }
        return toast({
            title: "Something went wrong while uploading your Artwork",
            status: 'error',
            position: 'bottom-right'
        });
    }



    const logout = async () => {
        setLoadingState(true);
        await accountController.logout();
        navigate("/", { replace: true });
        setLoadingState(false);
    }

    useEffect(() => {
        window.document.title = "Artworks | Artwork Marketplace"
    }, []);


    dayjs.extend(relativeTime);
    return <React.Fragment>
        <NavbarArtist
            title={"Artworks"}
            logout={() => logout()} />
        {artworkUploadProgress !== 0 && <ProgressLine
            visualParts={[{ percentage: `${artworkUploadProgress}%`, color: "#D53F8C" }]} />}
        {navigation.state === "loading" ? Loading() :
            <Flex
                px={{ base: "5", sm: "20", md: "0", lg: "0", xl: "32" }}
                flexDirection={{ base: "column", sm: "column", md: "column", lg: "row" }}
                justify={"center"}>
                <Box
                    pt={"14"}
                    px={{ base: "0", md: "20", lg: "20" }}>
                    <Flex flexDirection={"column"} alignContent={"center"} >
                        <Flex cursor={"pointer"} onClick={() => navigate("/artist/profile/update", { replace: true })}>
                            <Image
                                borderRadius='full'
                                boxSize='60px'
                                src={profileValue.avatar ? profileValue.avatar : emptyAvatar}
                                alt="small_avatar" />
                            <Box width={"5"}></Box>
                            <Box>
                                <Text lineHeight={"1"} fontWeight={"medium"} color={"gray.500"} fontSize={"2xl"}>{profileValue.name.first} {profileValue.name.last}</Text>
                                <Text fontWeight={"normal"} color={"gray.400"} lineHeight={"1"} mt={"2"}>Your personal account</Text>
                            </Box>
                        </Flex>
                        <Box mt={"20"}>
                            <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.400"}>Artworks</Text>
                            <Box my={"5"}> </Box>
                            <Flex mb={"3"}>
                                <BiCreditCardAlt color={"gray"} />
                                <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Billings and transactions</Text>
                            </Flex>
                            <Flex mb={"3"}>
                                <BiPaint color={"gray"} />
                                <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Sold Artworks</Text>
                            </Flex>

                        </Box>
                        <Box mt={"14"}>
                            <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.400"}>Access</Text>
                            <Box my={"5"}> </Box>
                            <Flex mb={"3"}>
                                <BiCog color={"gray"} />
                                <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Account Settings</Text>
                            </Flex>
                            <Flex mb={"3"}>
                                <BiShieldAlt2 color={"gray"} />
                                <Text fontSize={"md"} color={"gray.400"} lineHeight={"1"} ml={"2"}>Password and authentication</Text>
                            </Flex>

                        </Box>
                    </Flex>
                </Box>

                <Box
                    pt={"14"}
                    borderRight={"1px"}
                    borderLeft={"1px"}
                    borderColor={useBorder}
                    px={{ base: "5", sm: "20", md: "0", lg: "0", xl: "20" }}>
                    <form onSubmit={handleSubmit(onCreateArt)}>
                        <Flex flexDirection={{ base: "column", md: "row", lg: "row" }}>
                            <Box>
                                <Box>
                                    <input
                                        type="file"
                                        id="artImageId"
                                        ref={artImage}
                                        accept="image/png, image/jpeg"
                                        hidden
                                        onChange={onImageChange} />
                                    {artworkImage ? <label htmlFor={"artImageId"} cursor={"pointer"}  >
                                        <Image
                                            src={artworkImage}
                                            boxSize={"full"}
                                            height={"220px"}
                                            objectFit='cover'
                                            alt="Preview image"
                                            cursor={"pointer"}
                                            shadow={colorMode === "light" ? "2xl" : "dark-lg"}

                                            borderRadius={"3xl"} />
                                    </label> : <label htmlFor={"artImageId"}>
                                        <Image
                                            src={imgUploadArtSample}
                                            boxSize={"full"} height={"220px"}

                                            objectFit='cover'
                                            alt="Preview image"
                                            cursor={"pointer"}
                                            shadow={colorMode === "light" ? "2xl" : "dark-lg"}
                                            borderRadius={"3xl"} />
                                    </label>}

                                </Box>
                                <Text
                                    mt={"10"}
                                    mb={"5"}
                                    fontSize={"sm"}
                                    fontWeight={"bold"}
                                    color={"gray.400"}>Details</Text>
                                <Input
                                    maxLength={"225"}
                                    placeholder='Title'
                                    size='md'
                                    mb={"3"}
                                    {...register("title", { required: true })} />
                                <Textarea
                                    maxLength={"225"}
                                    placeholder="Write something about this artwork..."
                                    rows={6}
                                    mb={"3"}
                                    {...register("description", { required: true })} />
                                <Text
                                    my={"5"}
                                    fontSize={"sm"}
                                    fontWeight={"bold"}
                                    color={"gray.400"}>Price</Text>
                                <InputGroup>
                                    <InputLeftElement
                                        maxLength={"3"}
                                        pointerEvents='none'
                                        children={<Text>₱</Text>} />
                                    <Input
                                        type={"number"}
                                        placeholder={"Amount"}
                                        {...register("price", { required: true })} />
                                    <InputRightElement children={<Text>.00</Text>} />
                                </InputGroup>

                                <Flex
                                    flexDirection={{ base: "column", sm: "column", md: "column", lg: "row" }}
                                    justifyContent={"space-between"} mt={"5"} >
                                    <Box></Box> {/*  Fill only */}
                                    <Flex
                                        flexDirection={{ base: "column", sm: "column", md: "column", lg: "row" }}>
                                        <Button
                                            type={"submit"}
                                            isLoading={isSubmitting || toggleLoading}
                                            leftIcon={<BiCloudUpload />}
                                            background={"pink.400"}
                                            mr={{ base: 0, md: "2", lg: "2" }}
                                            mt={{ base: "2", md: 0, lg: 0 }}
                                            variant='solid'
                                            color={"white"}>
                                            Submit
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Box>
                        </Flex>
                    </form>
                </Box>
            </Flex>
        }

    </React.Fragment >;


    function Loading() {
        return <Progress size='xs' isIndeterminate colorScheme={"pink"} />;
    }
}

export default PageArtistArtwork