"use client";
import { useState } from "react";
import { createTaskModificar } from "@services/tasks.service";
import { Card } from "@/components/ui/card";

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
    <Card>
      <form className="space-y-4">
        <div className="text-sm text-muted-foreground">
          (WIP) Formulario de solicitar modificación
        </div>
      </form>
    </Card>
  );
}
