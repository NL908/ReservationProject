import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Dialog, DialogContent
} from '@mui/material';
import ShowDetailComponent from './ShowDetailComponent'; // Import the ShowDetailComponent
import { useStore } from './store/useStore';
import { SearchCriteria } from './types/SearchCriteria'

const ResultTable: React.FC = () => {
    const { filteredRows } = useStore();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<SearchCriteria | null>(null);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (row: SearchCriteria) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };

    const formatDateString = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date of Arrival</TableCell>
                            <TableCell>Date of Departure</TableCell>
                            <TableCell>Room Size</TableCell>
                            <TableCell>Room Quantity</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                                onClick={() => handleRowClick(row)}
                                sx={{ cursor: 'pointer' }}
                                data-testid={`row${row.id}`}
                            >
                                <TableCell data-testid={"arrivalDate" + row.id} >{formatDateString(row.arrivalDate)}</TableCell>
                                <TableCell data-testid={"departureDate" + row.id} >{formatDateString(row.departureDate)}</TableCell>
                                <TableCell data-testid={"roomSize" + row.id} >{row.roomSize}</TableCell>
                                <TableCell data-testid={"roomQuantity" + row.id} >{row.roomQuantity}</TableCell>
                                <TableCell data-testid={"firstName" + row.id} >{row.firstName}</TableCell>
                                <TableCell data-testid={"lastName" + row.id} >{row.lastName}</TableCell>
                                <TableCell data-testid={"email" + row.id} >{row.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{ width: '50%', margin: 'auto' }}>
                <DialogContent>
                    {selectedRow && <ShowDetailComponent data={selectedRow} onSaveHandle={handleClose} />}
                </DialogContent>
            </Dialog>
        </Paper>
    );
};

export default ResultTable;
