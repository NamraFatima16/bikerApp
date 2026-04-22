import { supabase } from '../supabase';

export type EmergencyContact = {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    relationship?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
};

export type CreateEmergencyContactInput = {
    name: string;
    phone: string;
    relationship?: string;
    is_primary?: boolean;
};

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
    const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('is_primary', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createEmergencyContact(
    input: CreateEmergencyContactInput,
): Promise<EmergencyContact> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({ ...input, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteEmergencyContact(id: string): Promise<void> {
    const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function sendSOS(
    latitude: number,
    longitude: number,
): Promise<boolean> {
    const { data, error } = await supabase.functions.invoke('send-sos', {
        body: {
            location: { latitude, longitude },
        },
    });

    if (error) throw error;
    return data?.success || false;
}