import apiRequest from "@/lib/apiClient";
import { BirdSpecies } from "../types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const useBirdSpecies = () => {
  const [birdSpecies, setBirdSpecies] = useState<BirdSpecies[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const session = useSession();

  const getBirdSpecies = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest<BirdSpecies[]>(
        "/api/BirdSpecies",
        "GET",
        session.data?.token,
      );
      setBirdSpecies(data);
    } catch (err) {
      setError(
        "Fehler beim Abrufen der Arten. Bitte versuchen Sie es später erneut.",
      );
      console.error("Error fetching species:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBirdSpecies();
  }, []);

  return {
    birdSpecies,
    loading,
    error,
  };
};
