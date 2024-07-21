import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShowDetailComponent from './ShowDetailComponent';
import { SearchCriteria } from './types/SearchCriteria';
import { useStore } from './store/useStore';
import { fetchReservationData, searchUrl, searhchArn, s3ReservationBukcketKey } from './utils/api'

// Mock Zustand store
jest.mock('./store/useStore', () => ({
    useStore: jest.fn(),
}));

jest.mock('./utils/api', () => ({
    fetchReservationData: jest.fn(),
}));

const mockData: SearchCriteria[] = [
    {
    id: 1,
    arrivalDate: '2024-07-16',
    departureDate: '2024-07-17',
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
}];

describe('ShowDetailComponent', () => {
    beforeEach(() => {
        const setFilteredRowsMock = jest.fn();
        // Mock the Zustand store return value
        (useStore as jest.Mock).mockReturnValue({
            filteredRows: mockData,
            setFilteredRows: setFilteredRowsMock,
        });

    });

    test('renders ShowDetailComponent', async () => {
        render(<ShowDetailComponent data={mockData[0]} onSaveHandle={jest.fn()} />);

        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Save')).toHaveTextContent('Save')
        expect(screen.getByText('Delete')).toBeInTheDocument();

        const firstNameInput = await screen.findByLabelText("First Name");
        expect(firstNameInput).toHaveValue(mockData.firstName)

        const lastNameInput = await screen.findByLabelText("Last Name");
        expect(lastNameInput).toHaveValue(mockData.lastName)

        const noteInput = await screen.findByLabelText("Note");
        expect(noteInput).toHaveValue(mockData.note)
    });

    test('Change text', async () => {
        render(<ShowDetailComponent data={mockData[0]} onSaveHandle={jest.fn()} />);
        const firstNameInput = await screen.findByLabelText("First Name");

        fireEvent.change(firstNameInput, { target: { value: 'Smith' } });
        expect(firstNameInput).toHaveValue('Smith')
    })

    test('save button mock', async () => {
        const onSave = jest.fn(() => new Promise(resolve => setTimeout(resolve, 500)));

        const fetchReservationDataMock = fetchReservationData as jest.Mock;
        const mockResult: SearchCriteria[] = []
        fetchReservationDataMock.mockResolvedValue(mockResult);

        render(<ShowDetailComponent data={mockData[0]} onSaveHandle={onSave} />);
        const saveButton = screen.getByText('Save')
        fireEvent.click(saveButton);
        expect(saveButton).toHaveTextContent('Saving...');

        const mockApiData = {
            "stateMachineArn": searhchArn,
            "input": JSON.stringify({
                "type": "update",
                "input": mockData[0],
                "s3params": s3ReservationBukcketKey
            })
        }

        await waitFor(() => {
            expect(fetchReservationDataMock).toHaveBeenCalledWith(searchUrl, mockApiData);
        });

        await waitFor(() => {
            expect(saveButton).toHaveTextContent('Save');
        });
    })

    test('delete button mock', async () => {
        const onSave = jest.fn(() => new Promise(resolve => setTimeout(resolve, 500)));
        const fetchReservationDataMock = fetchReservationData as jest.Mock;
        const mockResult: SearchCriteria[] = []
        fetchReservationDataMock.mockResolvedValue(mockResult);
        render(<ShowDetailComponent data={mockData[0]} onSaveHandle={onSave} />);
        const deleteButton = screen.getByText('Delete')
        fireEvent.click(deleteButton);
        expect(deleteButton).toHaveTextContent('Deleting...');

        const mockApiData = {
            "stateMachineArn": searhchArn,
            "input": JSON.stringify({
                "type": "delete",
                "input": {
                    "id": mockData[0].id,
                    "s3params": s3ReservationBukcketKey
                }
            })
        }

        await waitFor(() => {
            expect(fetchReservationDataMock).toHaveBeenCalledWith(searchUrl, mockApiData);
        });
        await waitFor(() => {
            expect(deleteButton).toHaveTextContent('Delete');
        });

        expect(fetchReservationDataMock).toHaveBeenCalledWith
    })
});