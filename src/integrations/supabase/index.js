import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

Post // table: posts
    id: number
    title: string
    body: string
    created_at: string
    author_id: string
    reactions?: Reaction[] // available if .select('*,reactions(*)') was done

Reaction // table: reactions
    id: number
    post_id: number // foreign key to Post
    user_id: string
    emoji: string

*/

// hooks

export const usePosts = () => useQuery({
    queryKey: ['posts'],
    queryFn: () => fromSupabase(supabase.from('posts').select('*,reactions(*)')),
});

export const useAddPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPost) => fromSupabase(supabase.from('posts').insert([newPost])),
        onSuccess: () => {
            queryClient.invalidateQueries('posts');
        },
    });
};

export const useReactions = (postId) => useQuery({
    queryKey: ['reactions', postId],
    queryFn: () => fromSupabase(supabase.from('reactions').select('*').eq('post_id', postId)),
});

const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw new Error(error.message);
    localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
    return data.user;
};

export const useGuestAuth = () => {
    const [guestUser, setGuestUser] = useState(null);

    useEffect(() => {
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
            const session = JSON.parse(storedSession);
            supabase.auth.setSession(session);
            setGuestUser(session.user);
        } else {
            signInAnonymously().then(user => {
                setGuestUser(user);
            }).catch(console.error);
        }
    }, []);

    return guestUser;
};

export const useAddReaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newReaction) => fromSupabase(supabase.from('reactions').insert([newReaction])),
        onSuccess: () => {
            queryClient.invalidateQueries('reactions');
        },
    });
};