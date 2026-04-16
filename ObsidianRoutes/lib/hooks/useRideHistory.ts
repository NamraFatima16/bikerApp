import { useQuery } from "@tanstack/react-query";
import { getRides, Ride, RideListFilters } from "../api/rides";

function applyClientFilters(rides: Ride[], filters?: RideListFilters): Ride[] {
  if (!filters || !filters.filterType || filters.filterType === "all")
    return rides;

  switch (filters.filterType) {
    case "bike":
      if (!filters.bikeId) return rides;
      return rides.filter((r) => r.bike_id === filters.bikeId);
    case "month":
      if (!filters.month) return rides;
      const month = filters.month as string;
      // month format: YYYY-MM
      return rides.filter((r) => r.created_at.startsWith(month));
    case "year":
      if (!filters.year) return rides;
      const year = filters.year as string;
      return rides.filter((r) => r.created_at.startsWith(year));
    default:
      return rides;
  }
}

export function useRideHistory(filters?: RideListFilters) {
  return useQuery<Ride[], Error>({
    queryKey: ["rideHistory", filters || {}],
    queryFn: async () => {
      const data = await getRides();
      return applyClientFilters(data, filters);
    },
  });
}
