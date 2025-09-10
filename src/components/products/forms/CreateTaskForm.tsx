"use client";

import * as React from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFirstPage } from "@/features/products/products.thunks";
import { apiClient } from "@/services/apiClient";
import type { UiProduct } from "@/types/products";
import { useToast } from "@/components/ui/use-toast";
import type { FormState, CreateNewPayload } from "@/types/forms";
import { USERS } from "@/lib/interfaces";
type AssignOption = (typeof USERS)[number] | "unassigned";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const INITIAL: FormState = {
  nombre: "",
  link: "",
  precio: "",
  prioridad: "media",
  asignado: "unassigned",
};

export default function CreateTaskForm() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [form, setForm] = React.useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = React.useState(false);

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      toast({ title: "Falta el nombre", variant: "destructive" });
      return;
    }
    const precioNum = Number.parseFloat(form.precio);
    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      toast({
        title: "Precio inválido",
        description: "Debe ser mayor a 0",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        producto: form.nombre,
        link: form.link || undefined,
        precio: precioNum,
        prioridad: form.prioridad,
        asignado: form.asignado === "unassigned" ? undefined : form.asignado,
        origen: "Nuevo" as const,
      };

      await createTaskNuevo(payload);

      toast({
        title: "Producto creado",
        description: "Se agregó correctamente.",
      });
      setForm(INITIAL);
      dispatch(fetchFirstPage());
    } catch (err: any) {
      toast({
        title: "Error al crear",
        description: err?.message ?? "No se pudo crear el producto",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre *</Label>
        <Input
          id="nombre"
          value={form.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          type="url"
          value={form.link}
          onChange={(e) => onChange("link", e.target.value)}
          placeholder="https://tuweb.com/producto"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="precio">Precio (UYU) *</Label>
        <Input
          id="precio"
          type="number"
          step="0.01"
          min="0.01"
          value={form.precio}
          onChange={(e) => onChange("precio", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Prioridad</Label>
        <Select
          value={form.prioridad}
          onValueChange={(v: FormState["prioridad"]) =>
            onChange("prioridad", v)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baja">Baja</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Asignado</Label>
        <Select
          value={form.asignado}
          onValueChange={(v: AssignOption) => onChange("asignado", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar usuario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Sin asignar</SelectItem>
            {USERS.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Creando..." : "Crear Producto"}
      </Button>
    </form>
  );
}

async function createTaskNuevo(body: CreateNewPayload) {
  return apiClient.post<{ id: string; ok: true }>("/products", body);
}
