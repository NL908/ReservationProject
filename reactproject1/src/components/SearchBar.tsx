import React, { useState } from 'react';
import { Grid, TextField, MenuItem, FormControl, Button, Box, Dialog, DialogContent } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SearchCriteria } from './types/SearchCriteria';
import ShowDetailComponent from './ShowDetailComponent';

interface SearchBar {
    arrivalDate: string;
    departureDate: string;
    roomSize: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface SearchBarProps {
    onSearch: (criteria: Partial<SearchCriteria>) => void;
    onClear: () => void;
}

const roomSizes = ['Small', 'Medium', 'Large'];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear }) => {
    const initialCriteria: Partial<SearchBar> = {
        arrivalDate: '',
        departureDate: '',
        roomSize: '',
        firstName: '',
        lastName: '',
        email: '',
    };

    const [searchCriteria, setSearchCriteria] = useState<SearchBar>(initialCriteria);
    const [openCreate, setOpenCreate] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown; name?: string }>) => {
        const { name, value } = e.target;
        setSearchCriteria(prevState => ({
            ...prevState,
            [name as string]: value,
        }));
    };

    const handleDateChange = (name: keyof SearchCriteria) => (date: Date | null) => {
        setSearchCriteria(prevState => ({
            ...prevState,
            [name]: date
        }));
    };

    const handleSearch = () => {
        onSearch(searchCriteria);
    };

    const handleClear = () => {
        setSearchCriteria(initialCriteria);
        onClear();
    };

    const handleCreate = () => {
        setOpenCreate(true);
    };

    const handleCloseCreate = () => {
        setOpenCreate(false);
    };

    const defaultValues: SearchCriteria = {
        id: 0, // use 0 as default
        arrivalDate: new Date().toISOString().slice(0, 10),
        departureDate: new Date().toISOString().slice(0, 10),
        roomSize: 'Small',
        roomQuantity: 1,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        streetName: '',
        streetNumber: '',
        zip: '',
        state: '',
        city: '',
        extras: {
            breakfast: false,
            tv: false,
            parking: false,
            wifi: false,
            balcony: false,
        },
        payment: '',
        note: '',
        tags: [],
        reminder: false,
        newsletter: false,
        confirm: false,
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ padding: 2, width: '100%', marginBottom: 3, backgroundColor: 'grey.100', borderRadius: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                        <DatePicker
                            label="Date of Arrival"
                            value={searchCriteria.arrivalDate === '' ? null : searchCriteria.arrivalDate}
                            onChange={handleDateChange('arrivalDate')}
                            InputProps={{ "data-testid": "arrivalDate" }}
                            renderInput={(params) => <TextField {...params} fullWidth sx={{ marginBottom: '0px' }}
                            />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <DatePicker
                            label="Date of Departure"
                            value={searchCriteria.departureDate === '' ? null : searchCriteria.departureDate}
                            onChange={handleDateChange('departureDate')}
                            InputProps={{ "data-testid": "departureDate" }}
                            renderInput={(params) => <TextField {...params} fullWidth sx={{ marginBottom: '0px' }} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                label="Room Size"
                                name="roomSize"
                                data-testid="roomSize"
                                value={searchCriteria.roomSize}
                                onChange={handleChange}
                                fullWidth
                                sx={{ marginBottom: '0px' }}
                            >
                                {roomSizes.map(size => (
                                    <MenuItem key={size} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            data-testid="firstName"
                            value={searchCriteria.firstName}
                            onChange={handleChange}
                            fullWidth
                            sx={{ marginBottom: '0px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            data-testid="lastName"
                            value={searchCriteria.lastName}
                            onChange={handleChange}
                            fullWidth
                            sx={{ marginBottom: '0px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            label="Email"
                            name="email"
                            data-testid="email"
                            value={searchCriteria.email}
                            onChange={handleChange}
                            fullWidth
                            sx={{ marginBottom: '0px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Button variant="contained" color="success" data-testid="createButton" onClick={handleCreate} fullWidth sx={{ marginBottom: '0px' }}>
                            Create
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Button variant="contained" color="primary" data-testid="searchButton" onClick={handleSearch} fullWidth sx={{ marginBottom: '0px' }}>
                            Search
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <Button variant="contained" color="secondary" data-testid="clearButton" onClick={handleClear} fullWidth sx={{ marginBottom: '0px' }}>
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Dialog open={openCreate} onClose={handleCloseCreate} fullWidth maxWidth="md">
                <DialogContent>
                    <ShowDetailComponent data={defaultValues} onSaveHandle={handleCloseCreate} />
                </DialogContent>
            </Dialog>
        </LocalizationProvider>
    );
};

export default SearchBar;
