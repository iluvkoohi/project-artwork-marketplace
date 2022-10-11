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
import { emptyAvatar } from '../../../const/url';

const Links = ['Dashboard', 'Projects', 'Team'];

function NavbarInCustomerEditProfile(props) {
    const { logout, title } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <Box >
                <Flex

                    justifyContent={'space-between'}
                    bg={useColorModeValue('white', 'gray.800')}
                    color={useColorModeValue('gray.600', 'white')}
                    minH={'60px'}
                    py={{ base: 2 }}
                    px={{ base: 4 }}
                    borderBottom={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.900')}
                    align={'center'}>
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
                            color={"gray.600"}>{title}</Box>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar size={'sm'} src={emptyAvatar} />
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
                                <MenuItem onClick={logout}>Sign out</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

            </Box>

        </>
    );
}

export default NavbarInCustomerEditProfile;