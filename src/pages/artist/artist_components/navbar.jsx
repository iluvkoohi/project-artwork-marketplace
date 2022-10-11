import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    useColorMode,
    Text,
    Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import emptyAvatar from "../../../images/empty-avatar.jpg";
import { useRecoilValue } from 'recoil';
import { profileState as atomProfileState } from '../../../state/recoilState';

const links = [
    { name: 'Sell', path: '/artist/artwork' },
    { name: 'Orders', path: '/artist/artwork' }
];

const NavLink = (props) => {
    const { title, action } = props;

    return < Link
        px={2}
        py={1}
        rounded={'md'}
        fontWeight={"normal"}
        fontSize={"sm"}
        color={"gray.400"}
        onClick={action}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}>
        {title}
    </Link >;
}
function NavbarArtist(props) {
    const { logout, title } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const profileValue = useRecoilValue(atomProfileState)
    const navigate = useNavigate();
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box
                            fontWeight={"medium"}
                            color={"gray.500"}
                            cursor={"pointer"}
                            onClick={() => navigate("/artist/main", { replace: true })}>{title}</Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {links.map((value) => (
                                <NavLink
                                    key={value.name}
                                    title={value.name}
                                    action={() => navigate(value.path, { replace: true })}></NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar size={'sm'} src={profileValue?.avatar ? profileValue?.avatar : emptyAvatar} />
                            </MenuButton>
                            <MenuList>

                                <MenuItem onClick={toggleColorMode}>
                                    {colorMode === 'light' ?
                                        <Box>
                                            <Flex>
                                                <MoonIcon />
                                                <Text lineHeight={0.9}>&nbsp;&nbsp;Switch to Dark</Text>
                                            </Flex>
                                        </Box> :
                                        <Box>
                                            <Flex>
                                                <SunIcon />
                                                <Text lineHeight={0.9}>&nbsp;&nbsp;Switch to Light</Text>
                                            </Flex>
                                        </Box>
                                    }
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem onClick={() => navigate('/artist/profile/update', { replace: true })}>Account Settings</MenuItem>
                                <MenuItem onClick={logout}>Sign out</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>

        </>
    );
}

export default NavbarArtist;