// ResultTable.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultTable from './ResultTable';
import { useStore } from './store/useStore';
import { SearchCriteria } from './types/SearchCriteria';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface mockShowDetailInput {
    data: SearchCriteria
}

// Mocking the ShowDetailComponent
jest.mock('./ShowDetailComponent', () => (props: mockShowDetailInput) => (
    <div data-testid="showDetailComponent">
        <div data-testid="showDetailArrivalDate">Arrival Date: {props.data.arrivalDate}</div>
        <div data-testid="showDetailDepartureDate">Departure Date: {props.data.departureDate}</div>
        <div data-testid="showDetailRoomSize">Room Size: {props.data.roomSize}</div>
        <div data-testid="showDetailFirstName">First Name: {props.data.firstName}</div>
        <div data-testid="showDetailLastName">Last Name: {props.data.lastName}</div>
        <div data-testid="showDetailEmail">Email: {props.data.email}</div>
    </div>
));

jest.mock('./store/useStore', () => ({
    useStore: jest.fn(),
}));

describe('ResultTable Component', () => {
    const mockData: SearchCriteria[] = [
        {
            id: 1,
            arrivalDate: '7/16/2024',
            departureDate: '7/17/2024',
            roomSize: 'Medium',
            roomQuantity: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '1234567890',
            streetName: 'Main St',
            streetNumber: '123',
            zip: '12345',
            state: 'State',
            city: 'City',
            extras: {
                breakfast: false,
                tv: false,
                parking: false,
                wifi: false,
                balcony: false,
            },
            payment: 'Credit Card',
            note: 'This is a note',
            tags: [],
            reminder: false,
            newsletter: false,
            confirm: false,
        },
        {
            id: 2,
            arrivalDate: '10/8/2024',
            departureDate: '10/11/2024',
            roomSize: 'Large',
            roomQuantity: 4,
            firstName: 'John',
            lastName: 'Bone',
            email: 'john.bone@example.com',
            phoneNumber: '1234567890',
            streetName: 'Main St',
            streetNumber: '123',
            zip: '12345',
            state: 'State',
            city: 'City',
            extras: {
                breakfast: true,
                tv: false,
                parking: true,
                wifi: false,
                balcony: false,
            },
            payment: 'Credit Card',
            note: 'This is a note',
            tags: ['Extras'],
            reminder: false,
            newsletter: true,
            confirm: false,
        }
    ];

    beforeEach(() => {
        // Mock the Zustand store return value
        (useStore as jest.Mock).mockReturnValue({
            filteredRows: mockData
        });
    });

    it('renders the table headers correctly', () => {
        render(<ResultTable/>);

        expect(screen.getByText('Date of Arrival')).toBeInTheDocument();
        expect(screen.getByText('Date of Departure')).toBeInTheDocument();
        expect(screen.getByText('Room Size')).toBeInTheDocument();
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders the table rows correctly', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ResultTable />
            </LocalizationProvider>
        );

        mockData.forEach((row) => {
            expect(screen.getByTestId(`row${row.id}`)).toBeInTheDocument();
            expect(screen.getByTestId("arrivalDate" + row.id)).toHaveTextContent(row.arrivalDate);
            expect(screen.getByTestId("departureDate" + row.id)).toHaveTextContent(row.departureDate);
            expect(screen.getByTestId("roomSize" + row.id)).toHaveTextContent(row.roomSize);
            expect(screen.getByTestId("roomQuantity" + row.id)).toHaveTextContent(row.roomQuantity);
            expect(screen.getByTestId("firstName" + row.id)).toHaveTextContent(row.firstName);
            expect(screen.getByTestId("lastName" + row.id)).toHaveTextContent(row.lastName);
            expect(screen.getByTestId("email" + row.id)).toHaveTextContent(row.email);
        });
    });

    it('opens the ShowDetailComponent with correct info on row click', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ResultTable />
            </LocalizationProvider>
        );

        const firstRow = screen.getByTestId(`row${1}`)
        expect(firstRow).toBeInTheDocument();
        fireEvent.click(firstRow);

        expect(screen.getByTestId('showDetailComponent')).toBeInTheDocument();
        expect(screen.getByTestId('showDetailFirstName')).toHaveTextContent(mockData[0].firstName);
        expect(screen.getByTestId('showDetailLastName')).toHaveTextContent(mockData[0].lastName);
    });
});
