import React, { useEffect } from 'react';
import SearchBar from './SearchBar';
import ResultTable from './ResultTable';
import { SearchCriteria } from './types/SearchCriteria'
import { fetchReservationData, searchUrl, searhchArn, s3ReservationBukcketKey } from './utils/api';
import { useStore } from './store/useStore';

const MainComponent: React.FC = () => {
    const { setFilteredRows } = useStore();

    const getAllReservation = async () => {
        const data = {
            "input": JSON.stringify({
                "s3params": s3ReservationBukcketKey
            }),
            "stateMachineArn": searhchArn
        }

        const reservationData = await fetchReservationData(searchUrl, data)
        setFilteredRows(reservationData)
    }

    useEffect(() => {
        getAllReservation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSearch = async (criteria: Partial<SearchCriteria>) => {
        const data = {
            "stateMachineArn": searhchArn,
            "input": JSON.stringify({
                "type": "search",
                "input": criteria,
                "s3params": s3ReservationBukcketKey
            })
        }
        const reservationData = await fetchReservationData(searchUrl, data)
        setFilteredRows(reservationData)
    };

    const handleClear = () => {
        getAllReservation()
    }

    return (
        <div>
            <SearchBar onSearch={handleSearch} onClear={handleClear} />
            <ResultTable/>
        </div>
    );
};

export default MainComponent;
