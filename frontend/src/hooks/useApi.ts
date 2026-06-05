import { useState, useEffect, useCallback } from 'react';
import { fetchApi, ApiError } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

export function useFetch<T>(endpoint: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { userId, isLoaded } = useAuth();

  const fetchData = useCallback(async () => {
    if (!endpoint || !isLoaded) return;
    if (!userId) {
        setError("User not authenticated");
        return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await fetchApi<T>(endpoint, {
          headers: {
              'X-User-Id': userId
          }
      });
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, userId, isLoaded]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useMutation<T, Payload = any>(endpoint: string, method: 'POST' | 'PUT' | 'DELETE' = 'POST') {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { userId, isLoaded } = useAuth();

  const mutate = async (payload?: Payload, dynamicEndpoint?: string): Promise<T | null> => {
    if (!isLoaded || !userId) {
        setError("User not authenticated");
        throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);
    try {
      const options: RequestInit = { 
          method,
          headers: {
              'X-User-Id': userId
          }
      };
      if (payload) {
        options.body = JSON.stringify(payload);
      }
      const finalEndpoint = dynamicEndpoint || endpoint;
      const result = await fetchApi<T>(finalEndpoint, options);
      return result;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
