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

const Links = ['Dashboard', 'Projects', 'Team'];

function NavbarInEditProfile(props) {
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
                        <Box>{title}</Box>

                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
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

export default NavbarInEditProfile;