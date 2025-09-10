"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchFirstPage } from "@/features/products/products.thunks";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import CreateTaskForm from "@/components/products/forms/CreateTaskForm";
import EditTaskForm from "@/components/products/forms/EditTaskForm";

export default function ProductFormSection() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFirstPage());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="nuevos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nuevos">Nuevos</TabsTrigger>
          <TabsTrigger value="modificar">Modificar</TabsTrigger>
        </TabsList>

        <TabsContent value="nuevos">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nuevo Producto</CardTitle>
              <CardDescription>
                Agrega un nuevo producto al catálogo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateTaskForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modificar">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Modificación</CardTitle>
              <CardDescription>
                Solicita cambios en un producto existente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditTaskForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
