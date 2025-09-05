"use client";
import { useState } from "react";
import { createTaskModificar } from "@services/tasks.service";

export default function EditTaskForm() {
  const [productId, setProductId] = useState("");
  const [prioridad, setPrioridad] = useState<
    "baja" | "media" | "alta" | "urgente"
  >("media");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!productId.trim()) {
      setMsg("Falta el ID del producto");
      return;
    }

    try {
      setSaving(true);
      await createTaskModificar({ productId, prioridad, notes });
      setMsg("Tarea creada");
      setNotes("");
    } catch (err: any) {
      setMsg(err?.message ?? "Error al crear tarea");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
      <label>
        ID de producto
        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="SKU o ID"
        />
      </label>

      <label>
        Prioridad
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value as any)}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
      </label>

      <label>
        Notas
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Detalle opcional"
        />
      </label>

      <button type="submit" disabled={saving}>
        {saving ? "Guardando…" : "Crear tarea"}
      </button>

      {msg && (
        <p style={{ color: msg.startsWith("Error") ? "red" : "green" }}>
          {msg}
        </p>
      )}
    </form>
  );
}
