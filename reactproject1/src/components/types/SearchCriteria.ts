export interface SearchCriteria {
    id: number;
    arrivalDate: string;
    departureDate: string;
    roomSize: string;
    roomQuantity: number | 0;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    streetName: string;
    streetNumber: string;
    zip: string;
    state: string;
    city: string;
    extras: {
        breakfast: boolean;
        tv: boolean;
        parking: boolean;
        wifi: boolean;
        balcony: boolean;
    };
    payment: string;
    note: string;
    tags: string[];
    reminder: boolean;
    newsletter: boolean;
    confirm: boolean;
}