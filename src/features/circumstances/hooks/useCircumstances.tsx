import { useState, useEffect } from "react";
import { Circumstance } from "../types";
import apiRequest from "@/lib/apiClient";
import { useSession } from "next-auth/react";

export const useCircumstances = () => {
  const [circumstances, setCircumstances] = useState<Circumstance[]>([]);
  const [newCircumstance, setNewCircumstance] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  const getCircumstances = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Circumstance[]>(
        "/api/Circumstances",
        "GET",
        session.data?.token,
      );
      setCircumstances(data);
    } catch (err) {
      setError(
        "Fehler beim Abrufen der Umstände. Bitte versuchen Sie es später erneut.",
      );
      console.error("Error fetching circumstances:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCircumstance = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(
        `/api/Circumstances/${id}`,
        "DELETE",
        session.data?.token,
      );
      await getCircumstances();
    } catch (err) {
      setError(
        "Fehler beim Löschen des Umstands. Bitte versuchen Sie es später erneut.",
      );
      console.error("Error deleting circumstance:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCircumstance = async () => {
    if (!newCircumstance.trim()) {
      setError("Bitte geben Sie einen Umstand ein.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiRequest("/api/Circumstances", "POST", session.data?.token, {
        name: newCircumstance,
      });
      await getCircumstances();
      setNewCircumstance("");
    } catch (err) {
      setError(
        "Fehler beim Hinzufügen des Umstands. Bitte versuchen Sie es später erneut.",
      );
      console.error("Error adding circumstance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCircumstances();
  }, []);

  return {
    circumstances,
    newCircumstance,
    setNewCircumstance,
    deleteCircumstance,
    addCircumstance,
    loading,
    error,
  };
};
