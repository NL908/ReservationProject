// SearchBar.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';
import { useStore } from './store/useStore';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

jest.mock('./store/useStore', () => ({
    useStore: jest.fn(),
}));

describe('SearchBar Component', () => {
    beforeAll(() => {
        // add window.matchMedia
        // this is necessary for the date picker to be rendered in desktop mode.
        // if this is not provided, the mobile mode is rendered, which might lead to unexpected behavior
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: (query) => ({
                media: query,
                // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
                matches: query === "(pointer: fine)",
                onchange: () => { },
                addEventListener: () => { },
                removeEventListener: () => { },
                addListener: () => { },
                removeListener: () => { },
                dispatchEvent: () => false,
            }),
        });
    });

    beforeEach(() => {
        // Mock the Zustand store return value
        (useStore as jest.Mock).mockReturnValue({});
    });

    afterAll(() => {
        delete window.matchMedia;
    });
    it('renders the search bar with input fields', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SearchBar onSearch={jest.fn()} onClear={jest.fn()} />
            </LocalizationProvider>
        );

        expect(screen.getByLabelText("Date of Arrival")).toBeInTheDocument();
        expect(screen.getByLabelText("Date of Departure")).toBeInTheDocument();
        expect(screen.getByLabelText("Room Size")).toBeInTheDocument();
        expect(screen.getByLabelText("First Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it('calls the search function on form submit', () => {
        const mockSearchFunction = jest.fn();
        render(<SearchBar onSearch={mockSearchFunction} onClear={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("First Name"), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: 'Doe' } });
        fireEvent.click(screen.getByText('Search'));

        expect(mockSearchFunction).toHaveBeenCalled();
    });

    it('captures user input correctly', () => {
        render(<SearchBar onSearch = {jest.fn()} onClear = { jest.fn() } />);

        const firstNameInput = screen.getByLabelText('First Name');
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

        expect(firstNameInput).toHaveValue('Jane');
    });

    it('updates the date when a new date is selected', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SearchBar onSearch={jest.fn()} onClear={jest.fn()} />
            </LocalizationProvider>
        );

        const arrivalDateInput = screen.getByTestId("arrivalDate").querySelector('input');
        fireEvent.change(arrivalDateInput, { target: { value: '07/21/2024' } });

        const departureDateInput = screen.getByTestId("departureDate").querySelector('input');
        fireEvent.change(departureDateInput, { target: { value: '07/22/2024' } });

        expect(arrivalDateInput).toHaveValue('07/21/2024');
        expect(departureDateInput).toHaveValue('07/22/2024');
    });

    it('clears all input fields when the clear button is clicked', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SearchBar onSearch={jest.fn()} onClear={jest.fn()} />
            </LocalizationProvider>
        );

        fireEvent.change(screen.getByLabelText("First Name"), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });

        const arrivalDateInput = screen.getByTestId('arrivalDate').querySelector('input');
        const departureDateInput = screen.getByTestId('departureDate').querySelector('input');
        fireEvent.change(arrivalDateInput, { target: { value: '07/20/2024' } });
        fireEvent.change(departureDateInput, { target: { value: '07/25/2024' } });

        fireEvent.click(screen.getByText('Clear'));

        expect(screen.getByLabelText("First Name")).toHaveValue('');
        expect(screen.getByLabelText("Last Name")).toHaveValue('');
        expect(screen.getByLabelText('Email')).toHaveValue('');
        expect(arrivalDateInput).toHaveValue('');
        expect(departureDateInput).toHaveValue('');
    });
});
