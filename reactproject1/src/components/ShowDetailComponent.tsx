import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, Grid, Box, Typography, FormHelperText, InputLabel, RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, Autocomplete, Chip, Switch } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SearchCriteria } from './types/SearchCriteria'
import { fetchReservationData, searchUrl, searhchArn, s3ReservationBukcketKey } from './utils/api';
import { useStore } from './store/useStore';

interface ShowDetailComponentProps {
    data: SearchCriteria;
    onSaveHandle: () => void;
}

const sizes = ['Small', 'Medium', 'Large'];

const ShowDetailComponent: React.FC<ShowDetailComponentProps> = ({ data, onSaveHandle }) => {
    const { setFilteredRows } = useStore();
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(data);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown; name?: string }>) => {
        const { name, value, type, checked } = e.target;
        if (name === 'reminder' || name === 'newsletter' || name === 'confirm') {
            setSearchCriteria(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        } else if (type === 'checkbox') {
            setSearchCriteria(prevState => ({
                ...prevState,
                extras: {
                    ...prevState.extras,
                    [name]: checked,
                },
            }));
        } else if (name === 'roomQuantity') {
            const quantity = Number(value);
            if (quantity >= 0) {
                setSearchCriteria(prevState => ({
                    ...prevState,
                    [name]: quantity,
                }));
            }
        } else {
            setSearchCriteria(prevState => ({
                ...prevState,
                [name as string]: value,
            }));
        }
    };

    const handleDateChange = (name: keyof SearchCriteria) => (date: Date | null) => {
        setSearchCriteria(prevState => ({
            ...prevState,
            [name]: date
        }));
    };

    const handleSave = async () => {
        setIsSaving(true)
        if (searchCriteria.id == 0) {
            // new entry Create
            searchCriteria.id = Date.now()
        }
        const data = {
            "stateMachineArn": searhchArn,
            "input": JSON.stringify({
                "type": "update",
                "input": searchCriteria,
                "s3params": s3ReservationBukcketKey
            })
        }
        const reservationData = await fetchReservationData(searchUrl, data)
        setFilteredRows(reservationData)
        onSaveHandle()
        setIsSaving(false)
    };

    const handleDelete = async () => {
        setIsDeleting(true)
        if (searchCriteria.id != 0) {
            // Add your delete logic here
            const data = {
                "stateMachineArn": searhchArn,
                "input": JSON.stringify({
                    "type": "delete",
                    "input": {
                        "id": searchCriteria.id,
                        
                    },
                    "s3params": s3ReservationBukcketKey
                })
            }
            const reservationData = await fetchReservationData(searchUrl, data)
            setFilteredRows(reservationData)
        }
        onSaveHandle()
        setIsDeleting(false)
    };

    const handleTagsChange = (event: React.SyntheticEvent<Element, Event>, value: string[]) => {
        setSearchCriteria((prevState) => ({
            ...prevState,
            tags: value,
        }));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ padding: 2, margin: '0 auto', backgroundColor: 'grey.100', borderRadius: 5 }}>
                <Typography variant="h6" gutterBottom>Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Date of Arrival"
                            value={searchCriteria.arrivalDate}
                            onChange={handleDateChange('arrivalDate')}
                            renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Date of Departure"
                            value={searchCriteria.departureDate}
                            onChange={handleDateChange('departureDate')}
                            renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="room-size-label">Room Size</InputLabel>
                            <Select
                                labelId="room-size-label"
                                name="roomSize"
                                value={searchCriteria.roomSize}
                                onChange={handleChange}
                                label="Room Size *"
                                displayEmpty
                            >
                                {sizes.map(size => (
                                    <MenuItem key={size} value={size}>{size}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Choose a room type</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Room Quantity"
                            name="roomQuantity"
                            type="number"
                            value={searchCriteria.roomQuantity}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={searchCriteria.firstName}
                            onChange={handleChange}
                            inputProps={{ maxLength: 25 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={searchCriteria.lastName}
                            onChange={handleChange}
                            inputProps={{ maxLength: 25 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            value={searchCriteria.email}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={searchCriteria.phoneNumber}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Street Name"
                            name="streetName"
                            value={searchCriteria.streetName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Street Number"
                            name="streetNumber"
                            value={searchCriteria.streetNumber}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Zip"
                            name="zip"
                            value={searchCriteria.zip}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="State"
                            name="state"
                            value={searchCriteria.state}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="City"
                            name="city"
                            value={searchCriteria.city}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <Typography component="legend">Extras</Typography>
                            <FormGroup row>
                                <FormControlLabel control={<Checkbox name="breakfast" checked={searchCriteria.extras.breakfast} onChange={handleChange} />} label="Breakfast" />
                                <FormControlLabel control={<Checkbox name="tv" checked={searchCriteria.extras.tv} onChange={handleChange} />} label="TV" />
                                <FormControlLabel control={<Checkbox name="parking" checked={searchCriteria.extras.parking} onChange={handleChange} />} label="Parking" />
                                <FormControlLabel control={<Checkbox name="wifi" checked={searchCriteria.extras.wifi} onChange={handleChange} />} label="Wifi" />
                                <FormControlLabel control={<Checkbox name="balcony" checked={searchCriteria.extras.balcony} onChange={handleChange} />} label="Balcony" />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <Typography component="legend">Payment Method</Typography>
                            <RadioGroup
                                row
                                aria-label="payment"
                                name="payment"
                                value={searchCriteria.payment}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="Credit Card" control={<Radio />} label="Credit Card" />
                                <FormControlLabel value="PayPal" control={<Radio />} label="PayPal" />
                                <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
                                <FormControlLabel value="Bitcoin" control={<Radio />} label="Bitcoin" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Note"
                            name="note"
                            value={searchCriteria.note}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={2}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            getOptionLabel={(option) => option}
                            value={searchCriteria.tags}
                            onChange={handleTagsChange}
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option: string, index: number) => {
                                    const { key, ...rest } = getTagProps({ index }); // Destructure the key prop
                                    return <Chip key={key} label={option} {...rest} />;
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Tags"
                                    placeholder="Add Tags"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormGroup row>
                                <FormControlLabel control={<Switch name="reminder" checked={searchCriteria.reminder} onChange={handleChange} />} label="Reminder" />
                                <FormControlLabel control={<Switch name="newsletter" checked={searchCriteria.newsletter} onChange={handleChange} />} label="Newsletter" />
                                <FormControlLabel control={<Switch name="confirm" checked={searchCriteria.confirm} onChange={handleChange} />} label="Confirm" />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2} justifyContent="space-between">
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={isSaving || isDeleting}>
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                            </Grid>
                            <Grid item sx={{ marginRight: 2 }}>
                                <Button variant="contained" color="error" onClick={handleDelete} disabled={isSaving || isDeleting}>
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
};

export default ShowDetailComponent;
