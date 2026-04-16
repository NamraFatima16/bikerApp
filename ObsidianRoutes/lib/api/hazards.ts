import { supabase } from "../supabase";

export type Hazard = {
  id: string;
  user_id: string;
  ride_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  hazard_type: "pothole" | "road_kill" | "near_miss" | "other";
  upvotes: number;
  photo_url?: string | null;
  notes?: string | null;
  created_at: string;
};

export type CreateHazardInput = {
  ride_id?: string;
  latitude: number;
  longitude: number;
  hazard_type: "pothole" | "road_kill" | "near_miss" | "other";
  photo_url?: string;
  notes?: string;
};

export async function createHazard(input: CreateHazardInput): Promise<Hazard> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("hazards")
    .insert({
      user_id: user.id,
      ride_id: input.ride_id || null,
      latitude: input.latitude,
      longitude: input.longitude,
      hazard_type: input.hazard_type,
      photo_url: input.photo_url || null,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Hazard;
}

export async function getHazardsByRide(rideId: string): Promise<Hazard[]> {
  const { data, error } = await supabase
    .from("hazards")
    .select("*")
    .eq("ride_id", rideId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function upvoteHazard(hazardId: string): Promise<boolean> {
  // Read current upvotes then increment (simple approach; may have race conditions)
  const { data: existing, error: fetchError } = await supabase
    .from("hazards")
    .select("upvotes")
    .eq("id", hazardId)
    .single();

  if (fetchError) throw fetchError;
  const current = (existing?.upvotes as number) || 0;
  const { error } = await supabase
    .from("hazards")
    .update({ upvotes: current + 1 })
    .eq("id", hazardId);

  if (error) throw error;
  return true;
}

export async function listHazardsRecent(limit = 50): Promise<Hazard[]> {
  const { data, error } = await supabase
    .from("hazards")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
