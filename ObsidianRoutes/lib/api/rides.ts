import { supabase } from '../supabase';

export type Ride = {
    id: string;
    user_id: string;
    bike_id?: string;
    start_time: string;
    end_time?: string;
    distance: number;
    duration: number;
    route_coordinates: number[][];
    max_speed?: number;
    avg_speed?: number;
    created_at: string;
};

export type CreateRideInput = {
    bike_id?: string;
    start_time: string;
    end_time: string;
    distance: number;
    duration: number;
    route_coordinates: number[][];
    max_speed?: number;
    avg_speed?: number;
};

export async function saveRide(input: CreateRideInput): Promise<Ride> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('ride_history')
        .insert({ ...input, user_id: user?.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getRides(): Promise<Ride[]> {
    const { data, error } = await supabase
        .from('ride_history')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}