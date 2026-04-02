import { supabase } from "../supabase";

export type Bike = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  engine_size?: number;
  license_plate?: string;
  odometer: number;
  created_at: string;
  updated_at: string;
};

export type CreateBikeInput = {
  make: string;
  model: string;
  year: number;
  engine_size?: number;
  license_plate?: string;
  odometer: number;
};

export async function getBikes(): Promise<Bike[]> {
  const { data, error } = await supabase
    .from("bikes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createBike(input: CreateBikeInput): Promise<Bike> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bikes")
    .insert({ ...input, user_id: user?.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBike(
  id: string,
  input: Partial<CreateBikeInput>,
): Promise<Bike> {
  const { data, error } = await supabase
    .from("bikes")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBike(id: string): Promise<void> {
  const { error } = await supabase.from("bikes").delete().eq("id", id);

  if (error) throw error;
}
