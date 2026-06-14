'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export type Role = 'owner' | 'admin' | 'customer';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('owner'); // Default to owner for preview purposes
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const fetchRole = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (data && data.role && active) {
          setRole(data.role as Role);
        }
      } catch (err) {
        console.error('Error fetching role:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (active) {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRole(session.user.id);
        } else {
          // Fallback to local storage if not authenticated
          const savedRole = localStorage.getItem('vision_role') as Role;
          if (savedRole && ['owner', 'admin', 'customer'].includes(savedRole)) {
            setRole(savedRole);
          }
          setLoading(false);
        }
      }
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchRole(session.user.id);
        } else {
          setLoading(false);
          // router.push('/auth'); // Redirect to auth on logout if we want strict
        }
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSetRole = (newRole: Role) => {
    // Provide a way to override role for testing in UI if not strictly bound by backend in preview
    setRole(newRole);
    localStorage.setItem('vision_role', newRole);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ role, setRole: handleSetRole, user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
