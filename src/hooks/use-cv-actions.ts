"use client";
import { useCallback } from "react";
import { useCVStore } from "@/store/cv-store";
import { toast } from "sonner";

/**
 * Handles CV CRUD operations with optimistic UI updates and API sync.
 */
export function useCVActions() {
  const store = useCVStore();

  const fetchCVs = useCallback(async () => {
    store.setLoading(true);
    try {
      const res = await fetch("/api/cvs");
      const json = await res.json();
      if (json.success) store.setCVs(json.data);
    } catch {
      toast.error("Impossible de charger les CV");
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const createCV = useCallback(async (title: string, template = "modern") => {
    try {
      const res = await fetch("/api/cvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, template }),
      });
      const json = await res.json();
      if (json.success) {
        store.addCVToList(json.data);
        toast.success(`CV "${title}" créé avec succès.`);
        return json.data;
      }
      throw new Error(json.error);
    } catch (e) {
      toast.error((e as Error).message);
      return null;
    }
  }, [store]);

  const saveCV = useCallback(async (id: string, data: Record<string, unknown>) => {
    store.setSaving(true);
    try {
      const res = await fetch(`/api/cvs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        store.updateCVInList(id, json.data);
        store.setUnsavedChanges(false);
        return json.data;
      }
      throw new Error(json.error);
    } catch (e) {
      toast.error(`Erreur de sauvegarde: ${(e as Error).message}`);
      return null;
    } finally {
      store.setSaving(false);
    }
  }, [store]);

  const deleteCV = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/cvs/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        store.removeCVFromList(id);
        toast.success("CV supprimé");
        return true;
      }
      throw new Error(json.error);
    } catch (e) {
      toast.error((e as Error).message);
      return false;
    }
  }, [store]);

  const setActiveCVById = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/cvs/${id}/active`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        const allRes = await fetch("/api/cvs");
        const allJson = await allRes.json();
        if (allJson.success) store.setCVs(allJson.data);
        toast.success("CV actif mis à jour");
      }
    } catch {
      toast.error("Impossible de changer le CV actif");
    }
  }, [store]);

  const runATSAnalysis = useCallback(async (id: string, jobDescription?: string) => {
    try {
      const res = await fetch(`/api/cvs/${id}/ats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const json = await res.json();
      if (json.success) {
        store.setAtsAnalysis(json.data.analysis);
        store.updateCVInList(id, { atsScore: json.data.score });
        return json.data;
      }
      throw new Error(json.error);
    } catch (e) {
      toast.error(`Erreur ATS: ${(e as Error).message}`);
      return null;
    }
  }, [store]);

  return { fetchCVs, createCV, saveCV, deleteCV, setActiveCVById, runATSAnalysis };
}
