import axios from 'axios';
import { Alert } from 'react-native';
import { useCallback, useState } from 'react';

const API_URL = 'http://localhost:8080/api';

export const useTransactions = userId => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });

    const fetchTransactions = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/transactions/${userId}`);
            setTransactions(res.data);
        } catch (error) {
            console.error('Error fetching transactions: ', error);
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/transactions/summary/${userId}`);
            setSummary(res.data);
        } catch (error) {
            console.error('Error fetching summary: ', error);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error('Error loading data: ', error);
        } finally {
            setLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    const deleteTransaction = async id => {
        try {
            const res = await axios.delete(`${API_URL}/transactions/${id}`);
            if (res.statusText !== 'OK') throw new Error('Failed to delete transaction');
            loadData();
            Alert.alert('Success', 'Transaction deleted successfully');
        } catch (error) {
            console.log('Error deleting transaction: ', error);
            Alert.alert('Error', error.message);
        }
    };

    return { loading, loadData, transactions, summary, deleteTransaction };
};
