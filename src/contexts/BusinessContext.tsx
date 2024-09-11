import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface Business {
  id: string;
  name: string;
  // Add other business fields as needed
}

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  error: string | null;
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined,
);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    async function loadBusiness() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        if (error) throw error;
        setBusiness(data);
      } catch (e) {
        setError('Error loading business profile');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadBusiness();
  }, [user, supabase]);

  return (
    <BusinessContext.Provider value={{ business, loading, error }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
