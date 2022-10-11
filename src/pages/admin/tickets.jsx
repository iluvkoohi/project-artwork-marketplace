import { ExternalLinkIcon, PhoneIcon } from '@chakra-ui/icons';
import { Progress, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Link, Box, IconButton, Flex, useColorModeValue, Tooltip, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Image, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { Ticket } from '../../controllers/ticket'
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

function AdminTickets() {

    const ticketController = new Ticket();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const getTickets = async () => {
        const { data } = await ticketController.getVerificationTickets();
        setTickets(data);
    }
    const handleApproveTicket = async (data) => {
        onClose();
        const { ticketId, accountId } = data;
        await ticketController.updateVerificationTicketStatus({
            ticketId,
            accountId,
            ticketStatus: "completed",
            accountVerified: true
        });
        await getTickets();
    }


    useEffect(() => {
        getTickets();
    }, []);

    const useAcceptColor = useColorModeValue("green", "green");
    const useReject = useColorModeValue("red", "red");

    console.log(tickets)
    return <>
        {!tickets && <Loading />}
        <TableContainer mx={"20"}>
            <Table variant='simple'>
                <TableCaption>Imperial to metric conversion factors</TableCaption>
                <Thead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Valid ID</Th>
                        <Th>Name</Th>
                        <Th>Address</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {tickets?.map((value, index) => {
                        const { profile, profile: { address } } = value;
                        return <Tr key={value._id}>
                            <Td>{index + 1}</Td>
                            <Td>
                                <Box>
                                    <Link href={value.photoUrl} title={"hello"} isExternal>
                                        View<ExternalLinkIcon mx='2px' />
                                    </Link>
                                </Box>
                            </Td>
                            <Td>{profile.name.first} {profile.name.last}</Td>
                            <Td>{address.name}</Td>
                            <Td>
                                <Flex>
                                    <Tooltip label='Reject' fontSize='md' hasArrow>
                                        <IconButton
                                            aria-label='Reject'
                                            size='lg'
                                            icon={<AiOutlineClose color={useReject} />}
                                            mr={2} />
                                    </Tooltip>

                                    <Tooltip label='Approve' fontSize='md' hasArrow>
                                        <IconButton
                                            aria-label='Approve'
                                            size='lg'
                                            icon={<AiOutlineCheck color={useAcceptColor} />}
                                            onClick={() => {
                                                onOpen();
                                                setSelectedTicket(value);
                                            }} />
                                    </Tooltip>

                                </Flex>
                            </Td>
                        </Tr>
                    })}
                </Tbody>
            </Table>
        </TableContainer>
        {selectedTicket && <ConfirmModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            selectedTicket={selectedTicket}
            onApprove={handleApproveTicket} />}
    </>;

    function ConfirmModal({ isOpen, onOpen, onClose, selectedTicket, onApprove }) {
        const { profile, profile: { address, contact }, photoUrl, _id, accountId } = selectedTicket;
        return (
            <>
                <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"lg"}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{profile.name.first} {profile.name.last}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Text>{contact.email}</Text>
                            <Text mb={3}>{contact.number}</Text>
                            <hr />
                            <Text mt={3}>{address.name}</Text>
                            <Box boxSize='fit-content' mt={5}>
                                <Image src={photoUrl} alt={photoUrl} fit={"cover"} />
                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            <Button background={"green"} mr={3} onClick={() => onApprove({
                                ticketId: _id,
                                accountId: accountId
                            })}>
                                Approve
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
    }


    function Loading() {
        return <Progress size='xs' isIndeterminate colorScheme={"pink"} />;
    }
}

export default AdminTickets