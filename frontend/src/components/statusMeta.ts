// Metadados visuais por status de compartimento (cor + rótulo)
import type { CompartmentStatus } from "../api/types";

export const STATUS_META: Record<
  CompartmentStatus,
  { color: string; label: string }
> = {
  nominal: { color: "#16a34a", label: "NOMINAL" },
  warning: { color: "#f59e0b", label: "ATENÇÃO" },
  critical: { color: "#dc2626", label: "CRÍTICO" },
};

// "há X segundos / X min" a partir de um timestamp ISO
export function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `há ${seconds} segundo${seconds === 1 ? "" : "s"}`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `há ${hours} h`;
}
