import { useEffect, useState } from "react";
import { tasksApi } from "./api";
export function useTasks(token, onLogout) {
  const [lists, setLists] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    tasksApi
      .lists(token, controller.signal)
      .then(setLists)
      .catch((error) => {
        if (error.name !== "AbortError") {
          if (error.status === 401) onLogout();
          else setError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [token, onLogout]);
  async function mutate(operation) {
    setBusy(true);
    setError("");
    try {
      await operation();
      setLists(await tasksApi.lists(token));
      return true;
    } catch (error) {
      if (error.status === 401) onLogout();
      else setError(error.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  return { lists, loading, error, busy, mutate };
}
