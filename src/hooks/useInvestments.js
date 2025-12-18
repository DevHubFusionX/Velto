import { useState, useEffect } from 'react';
import { investmentService } from '../services/investmentService';

export const useInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await investmentService.getAll();
      setInvestments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { investments, loading, error, refetch: fetchInvestments };
};
