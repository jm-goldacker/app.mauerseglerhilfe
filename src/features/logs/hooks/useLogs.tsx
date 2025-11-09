import apiRequest from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LogEntry } from "../types";

export const useLogs = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const session = useSession();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addLog = async (entry: LogEntry) => {
    setError(null);
    setLoading(true);

    try {
      await apiRequest("api/LogEntries", "POST", session.data?.token, entry);
      await getLogs();
    } catch (err) {
      setError(
        "Fehler beim hinzufügen eines neuen Eintrags. Bitte versuchen Sie es später erneut.",
      );
      console.error("Error adding log:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLog = async (entry: LogEntry) => {
    setError(null);
    setLoading(true);

    try {
      await apiRequest(
        "api/LogEntries/" + entry.id,
        "PUT",
        session.data?.token,
        entry,
      );
      await getLogs();
    } catch (err) {
      setError(
        "Fehler beim Updaten des Eintrags mit der ID " +
          entry.id +
          ". Bitte versuchen Sie es später erneut.",
      );
      console.error("Error updating entry:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id: number) => {
    setError(null);
    setLoading(true);

    try {
      await apiRequest("/api/LogEntries/" + id, "DELETE", session.data?.token);
      await getLogs();
    } catch (err) {
      setError(
        "Fehler beim Löschen des Eintrags mit der ID " +
          id +
          ". Bitte versuchen Sie es später erneut.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLogs = async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await apiRequest<LogEntry[]>(
        "/api/LogEntries",
        "GET",
        session.data?.token,
      );
      setLogEntries(data);
    } catch (err) {
      setError(
        "Fehler beim Abrufen der Einträge. Bitte versuchen Sie es später erneut.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogs();
  }, [session]);

  return {
    logEntries,
    addLog,
    updateLog,
    deleteLog,
    loading,
    error,
  };
};
