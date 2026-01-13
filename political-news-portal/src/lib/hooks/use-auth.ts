/**
 * HOOK DE AUTENTICACIÓN - Integración con Supabase Auth
 * 
 * Hook personalizado para manejar autenticación con Supabase
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { getOrCreateAuthorFromUser } from '@/lib/services/authors';
import type { User as AppUser } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadAppUser(session.user);
      } else {
        setAppUser(null);
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadAppUser(session.user);
      } else {
        setAppUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadAppUser(supabaseUser: User) {
    try {
      // Obtener o crear autor asociado
      const author = await getOrCreateAuthorFromUser(
        supabaseUser.id,
        supabaseUser.email!,
        supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0]
      );

      setAppUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: author.name,
        role: (author.role as 'admin' | 'editor' | 'writer') || 'writer',
        avatar: author.avatar || supabaseUser.user_metadata?.avatar_url,
      });
    } catch (error) {
      console.error('Error loading app user:', error);
      // Fallback a datos básicos
      setAppUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
        role: 'writer',
        avatar: supabaseUser.user_metadata?.avatar_url,
      });
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/login');
  };

  return {
    user,
    appUser,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
}
