// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { toast } from "sonner";
// import {
//   Search,
//   ExternalLink,
//   Edit,
//   Eye,
//   Trash2,
//   Sun,
//   Moon,
//   MoreHorizontal,
//   Plus,
// } from "lucide-react";
// import { useTheme } from "next-themes";
// import type { Product, Estado, Prioridad } from "@/lib/interfaces";
// import { USERS, PRIORITIES, STATES } from "@/lib/interfaces";
// import { useItems } from "@/lib/use-items";
// import { getPriorityColor, getStateColor } from "@/lib/utils/styles";

// type AssignOption = (typeof USERS)[number] | "unassigned";

// export default function ProductManager() {
//   const { theme, setTheme } = useTheme();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     estado: "",
//     prioridad: "",
//     asignado: "",
//     creador: "",
//     origen: "",
//   });
//   const [sortBy, setSortBy] = useState<keyof Product>("fecha");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

//   const { items: products, setItems, loading, error, refresh } = useItems();

//   Form states
//   const [newProductForm, setNewProductForm] = useState({
//     nombre: "",
//     link: "",
//     precio: "",
//     prioridad: "media" as const,
//     asignado: "",
//   });

//   const [modifyProductForm, setModifyProductForm] = useState({
//     url: "",
//     nombre: "",
//     comentario: "",
//     prioridad: "media" as const,
//     asignado: "",
//   });

//   const [urlPreview, setUrlPreview] = useState<{
//     nombre: string;
//     imagen?: string;
//     precio?: number;
//   } | null>(null);
//   const [urlNotFound, setUrlNotFound] = useState(false);

//   Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "t" || e.key === "T") {
//         e.preventDefault();
//         setTheme(theme === "dark" ? "light" : "dark");
//       }
//       if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
//         e.preventDefault();
//         document.getElementById("search-input")?.focus();
//       }
//       if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
//         e.preventDefault();
//         Submit active form
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [theme, setTheme]);

//   Mock URL resolution
//   const resolveUrl = async (url: string) => {
//     Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const existingProduct = products.find((p) => p.link === url);
//     if (existingProduct) {
//       setUrlPreview({
//         nombre: existingProduct.producto,
//         precio: existingProduct.precio,
//       });
//       setUrlNotFound(false);
//     } else {
//       setUrlPreview(null);
//       setUrlNotFound(true);
//     }
//   };

//   Handle URL input change
//   useEffect(() => {
//     if (modifyProductForm.url) {
//       const timeoutId = setTimeout(() => {
//         resolveUrl(modifyProductForm.url);
//       }, 300);
//       return () => clearTimeout(timeoutId);
//     } else {
//       setUrlPreview(null);
//       setUrlNotFound(false);
//     }
//   }, [modifyProductForm.url]);

//   Filter and sort products
//   const filteredProducts = useMemo(() => {
//     const filtered = products.filter((product) => {
//       const matchesSearch =
//         product.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (product.comentario?.toLowerCase().includes(searchTerm.toLowerCase()) ??
//           false);

//       const matchesFilters = Object.entries(filters).every(([key, value]) => {
//         if (!value) return true;
//         return product[key as keyof Product] === value;
//       });

//       return matchesSearch && matchesFilters;
//     });

//     filtered.sort((a, b) => {
//       let aValue = a[sortBy];
//       let bValue = b[sortBy];

//       if (sortBy === "fecha") {
//         aValue = new Date(aValue as string).getTime();
//         bValue = new Date(bValue as string).getTime();
//       }

//       if (sortBy === "prioridad") {
//         const priorityOrder = { baja: 1, media: 2, alta: 3 };
//         aValue = priorityOrder[aValue as keyof typeof priorityOrder];
//         bValue = priorityOrder[bValue as keyof typeof priorityOrder];
//       }

//       if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
//       return 0;
//     });

//     return filtered;
//   }, [products, searchTerm, filters, sortBy, sortOrder]);

//   Pagination
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleCreateProduct = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!newProductForm.nombre || !newProductForm.precio) {
//       toast.error("Nombre y precio son requeridos");
//       return;
//     }

//     const precio = Number.parseFloat(newProductForm.precio);
//     if (precio <= 0) {
//       toast.error("El precio debe ser mayor a 0");
//       return;
//     }

//     const newProduct: Product = {
//       id: Date.now().toString(),
//       origen: "Nuevo",
//       producto: newProductForm.nombre,
//       link: newProductForm.link || undefined,
//       precio,
//       prioridad: newProductForm.prioridad,
//       asignado: newProductForm.asignado || undefined,
//       estado: "Pendiente",
//       creador: "Silvana",
//       fecha: new Date().toISOString().split("T")[0],
//       historial: [
//         {
//           fecha: new Date().toISOString().split("T")[0],
//           cambio: "Producto creado",
//           usuario: "Silvana",
//         },
//       ],
//     };

//     setItems((prev) => [newProduct, ...prev]);
//     setNewProductForm({
//       nombre: "",
//       link: "",
//       precio: "",
//       prioridad: "media",
//       asignado: "",
//     });
//     toast.success("Producto creado");
//   };

//   const handleCreateModification = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!modifyProductForm.url || !modifyProductForm.comentario) {
//       toast.error("URL y comentario son requeridos");
//       return;
//     }

//     if (modifyProductForm.comentario.length < 10) {
//       toast.error("El comentario debe tener al menos 10 caracteres");
//       return;
//     }

//     const newModification: Product = {
//       id: Date.now().toString(),
//       origen: "Modificar",
//       producto:
//         modifyProductForm.nombre || urlPreview?.nombre || "Producto sin nombre",
//       link: modifyProductForm.url,
//       precio: urlPreview?.precio,
//       prioridad: modifyProductForm.prioridad,
//       asignado: modifyProductForm.asignado || undefined,
//       estado: "Pendiente",
//       creador: "Silvana",
//       comentario: modifyProductForm.comentario,
//       fecha: new Date().toISOString().split("T")[0],
//       historial: [
//         {
//           fecha: new Date().toISOString().split("T")[0],
//           cambio: "Solicitud de modificación creada",
//           usuario: "Silvana",
//         },
//       ],
//     };

//     setItems((prev) => [newModification, ...prev]);
//     setModifyProductForm({
//       url: "",
//       nombre: "",
//       comentario: "",
//       prioridad: "media",
//       asignado: "",
//     });
//     setUrlPreview(null);
//     setUrlNotFound(false);
//     toast.success("Solicitud de modificación creada");
//   };

//   const updateProduct = (id: string, updates: Partial<Product>) => {
//     setItems((prev) =>
//       prev.map((product) => {
//         if (product.id === id) {
//           const updated = { ...product, ...updates };

//           Add to history
//           const changes = Object.entries(updates).map(([key, value]) => {
//             if (key === "estado") return `Estado cambiado a ${value}`;
//             if (key === "prioridad") return `Prioridad cambiada a ${value}`;
//             if (key === "asignado") return `Asignado a ${value}`;
//             return `${key} actualizado`;
//           });

//           updated.historial = [
//             ...(updated.historial || []),
//             ...changes.map((cambio) => ({
//               fecha: new Date().toISOString().split("T")[0],
//               cambio,
//               usuario: "Silvana",
//             })),
//           ];

//           return updated;
//         }
//         return product;
//       })
//     );

//     toast.success("Producto actualizado");
//   };

//   const handleDeleteProduct = () => {
//     if (deleteProduct) {
//       setItems((prev) => prev.filter((p) => p.id !== deleteProduct.id));
//       toast.success("Producto eliminado");
//       setDeleteProduct(null);
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "alta":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
//       case "media":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
//       case "baja":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
//     }
//   };

//   const getStateColor = (state: string) => {
//     switch (state) {
//       case "Terminado":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
//       case "En progreso":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
//       case "Pendiente":
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center">
//           <div className="mr-4 flex">
//             <h1 className="text-lg font-semibold">Gestor de Productos</h1>
//           </div>

//           <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
//             <div className="w-full flex-1 md:w-auto md:flex-none">
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="search-input"
//                   placeholder="Buscar productos..."
//                   className="pl-8 md:w-[300px]"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className="transition-all duration-200 hover:scale-105"
//             >
//               <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//               <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//               <span className="sr-only">Alternar tema</span>
//             </Button>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Column - Forms */}
//           <div className="space-y-6">
//             <Tabs defaultValue="nuevos" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="nuevos">Nuevos</TabsTrigger>
//                 <TabsTrigger value="modificar">Modificar</TabsTrigger>
//               </TabsList>

//               <TabsContent value="nuevos" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Crear Nuevo Producto</CardTitle>
//                     <CardDescription>
//                       Agrega un nuevo producto al catálogo
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <form onSubmit={handleCreateProduct} className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="nombre">Nombre *</Label>
//                         <Input
//                           id="nombre"
//                           value={newProductForm.nombre}
//                           onChange={(e) =>
//                             setNewProductForm((prev) => ({
//                               ...prev,
//                               nombre: e.target.value,
//                             }))
//                           }
//                           required
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="link">Link</Label>
//                         <Input
//                           id="link"
//                           type="url"
//                           value={newProductForm.link}
//                           onChange={(e) =>
//                             setNewProductForm((prev) => ({
//                               ...prev,
//                               link: e.target.value,
//                             }))
//                           }
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="precio">Precio (UYU) *</Label>
//                         <Input
//                           id="precio"
//                           type="number"
//                           step="0.01"
//                           min="0.01"
//                           value={newProductForm.precio}
//                           onChange={(e) =>
//                             setNewProductForm((prev) => ({
//                               ...prev,
//                               precio: e.target.value,
//                             }))
//                           }
//                           required
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="prioridad-nuevo">Prioridad</Label>
//                         <Select
//                           value={newProductForm.prioridad}
//                           onValueChange={(
//                             value: typeof newProductForm.prioridad
//                           ) =>
//                             setNewProductForm((prev) => ({
//                               ...prev,
//                               prioridad: value,
//                             }))
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="baja">Baja</SelectItem>
//                             <SelectItem value="media">Media</SelectItem>
//                             <SelectItem value="alta">Alta</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="asignado-nuevo">Asignado</Label>
//                         <Select
//                           value={newProductForm.asignado}
//                           onValueChange={(value: AssignOption) =>
//                             setNewProductForm((prev) => ({
//                               ...prev,
//                               asignado: value === "unassigned" ? "" : value,
//                             }))
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Seleccionar usuario" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="unassigned">
//                               Sin asignar
//                             </SelectItem>
//                             {USERS.map((user) => (
//                               <SelectItem key={user} value={user}>
//                                 {user}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <Button type="submit" className="w-full">
//                         <Plus className="mr-2 h-4 w-4" />
//                         Crear Producto
//                       </Button>
//                     </form>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="modificar" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Solicitar Modificación</CardTitle>
//                     <CardDescription>
//                       Solicita cambios en un producto existente
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <form
//                       onSubmit={handleCreateModification}
//                       className="space-y-4"
//                     >
//                       <div className="space-y-2">
//                         <Label htmlFor="url">URL del Producto *</Label>
//                         <Input
//                           id="url"
//                           type="url"
//                           value={modifyProductForm.url}
//                           onChange={(e) =>
//                             setModifyProductForm((prev) => ({
//                               ...prev,
//                               url: e.target.value,
//                             }))
//                           }
//                           required
//                         />
//                         {urlNotFound && (
//                           <p className="text-sm text-muted-foreground">
//                             No se encontró el producto; podés enviar la
//                             solicitud igual.
//                           </p>
//                         )}
//                       </div>

//                       {urlPreview && (
//                         <Card className="p-3">
//                           <div className="flex items-center space-x-3">
//                             <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
//                               <span className="text-xs">IMG</span>
//                             </div>
//                             <div>
//                               <p className="font-medium">{urlPreview.nombre}</p>
//                               {urlPreview.precio && (
//                                 <p className="text-sm text-muted-foreground">
//                                   ${urlPreview.precio.toFixed(2)} UYU
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </Card>
//                       )}

//                       <div className="space-y-2">
//                         <Label htmlFor="nombre-mod">Nombre (opcional)</Label>
//                         <Input
//                           id="nombre-mod"
//                           value={modifyProductForm.nombre}
//                           onChange={(e) =>
//                             setModifyProductForm((prev) => ({
//                               ...prev,
//                               nombre: e.target.value,
//                             }))
//                           }
//                           placeholder="Dejar vacío para mantener el nombre actual"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="comentario">
//                           Comentario/Descripción *
//                         </Label>
//                         <Textarea
//                           id="comentario"
//                           value={modifyProductForm.comentario}
//                           onChange={(e) =>
//                             setModifyProductForm((prev) => ({
//                               ...prev,
//                               comentario: e.target.value,
//                             }))
//                           }
//                           placeholder="Describe los cambios que necesitas..."
//                           required
//                           minLength={10}
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="prioridad-mod">Prioridad</Label>
//                         <Select
//                           value={modifyProductForm.prioridad}
//                           onValueChange={(
//                             value: typeof modifyProductForm.prioridad
//                           ) =>
//                             setModifyProductForm((prev) => ({
//                               ...prev,
//                               prioridad: value,
//                             }))
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="baja">Baja</SelectItem>
//                             <SelectItem value="media">Media</SelectItem>
//                             <SelectItem value="alta">Alta</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="asignado-mod">Asignado</Label>
//                         <Select
//                           value={modifyProductForm.asignado}
//                           onValueChange={(value) =>
//                             setModifyProductForm((prev) => ({
//                               ...prev,
//                               asignado: value === "unassigned" ? "" : value,
//                             }))
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Seleccionar usuario" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="unassigned">
//                               Sin asignar
//                             </SelectItem>
//                             {USERS.map((user) => (
//                               <SelectItem key={user} value={user}>
//                                 {user}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <Button type="submit" className="w-full">
//                         <Edit className="mr-2 h-4 w-4" />
//                         Crear Solicitud
//                       </Button>
//                     </form>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>

//           {/* Right Column - Table */}
//           <div className="space-y-4">
//             {/* Filters */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Filtros</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   <Select
//                     value={filters.estado}
//                     onValueChange={(value) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         estado: value === "all" ? "" : value,
//                       }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Estado" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">Todos</SelectItem>
//                       {STATES.map((state) => (
//                         <SelectItem key={state} value={state}>
//                           {state}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Select
//                     value={filters.prioridad}
//                     onValueChange={(value) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         prioridad: value === "all" ? "" : value,
//                       }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Prioridad" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">Todas</SelectItem>
//                       {PRIORITIES.map((priority) => (
//                         <SelectItem key={priority} value={priority}>
//                           {priority.charAt(0).toUpperCase() + priority.slice(1)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Select
//                     value={filters.asignado}
//                     onValueChange={(value) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         asignado: value === "all" ? "" : value,
//                       }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Asignado" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">Todos</SelectItem>
//                       <SelectItem value="unassigned">Sin asignar</SelectItem>
//                       {USERS.map((user) => (
//                         <SelectItem key={user} value={user}>
//                           {user}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {Object.values(filters).some(Boolean) && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="mt-4 bg-transparent"
//                     onClick={() =>
//                       setFilters({
//                         estado: "",
//                         prioridad: "",
//                         asignado: "",
//                         creador: "",
//                         origen: "",
//                       })
//                     }
//                   >
//                     Limpiar filtros
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Products Table */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Productos ({filteredProducts.length})</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-[600px]">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead
//                           className="cursor-pointer"
//                           onClick={() => {
//                             setSortBy("producto");
//                             setSortOrder(
//                               sortBy === "producto" && sortOrder === "asc"
//                                 ? "desc"
//                                 : "asc"
//                             );
//                           }}
//                         >
//                           Producto
//                         </TableHead>
//                         <TableHead>Link</TableHead>
//                         <TableHead>Precio</TableHead>
//                         <TableHead
//                           className="cursor-pointer"
//                           onClick={() => {
//                             setSortBy("prioridad");
//                             setSortOrder(
//                               sortBy === "prioridad" && sortOrder === "asc"
//                                 ? "desc"
//                                 : "asc"
//                             );
//                           }}
//                         >
//                           Prioridad
//                         </TableHead>
//                         <TableHead>Asignado</TableHead>
//                         <TableHead
//                           className="cursor-pointer"
//                           onClick={() => {
//                             setSortBy("estado");
//                             setSortOrder(
//                               sortBy === "estado" && sortOrder === "asc"
//                                 ? "desc"
//                                 : "asc"
//                             );
//                           }}
//                         >
//                           Estado
//                         </TableHead>
//                         <TableHead>Creador</TableHead>
//                         <TableHead
//                           className="cursor-pointer"
//                           onClick={() => {
//                             setSortBy("fecha");
//                             setSortOrder(
//                               sortBy === "fecha" && sortOrder === "asc"
//                                 ? "desc"
//                                 : "asc"
//                             );
//                           }}
//                         >
//                           Fecha
//                         </TableHead>
//                         <TableHead>Acciones</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {paginatedProducts.map((product) => (
//                         <TableRow key={product.id}>
//                           <TableCell>
//                             <div className="space-y-1">
//                               <div className="font-medium">
//                                 {product.producto}
//                               </div>
//                               <Badge variant="outline" className="text-xs">
//                                 {product.origen}
//                               </Badge>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             {product.link && (
//                               <Button variant="ghost" size="icon" asChild>
//                                 <a
//                                   href={product.link}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   <ExternalLink className="h-4 w-4" />
//                                 </a>
//                               </Button>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {product.precio &&
//                               `$${product.precio.toFixed(2)} UYU`}
//                           </TableCell>
//                           <TableCell>
//                             <Select
//                               value={product.prioridad}
//                               onValueChange={(
//                                 value: typeof product.prioridad
//                               ) =>
//                                 updateProduct(product.id, { prioridad: value })
//                               }
//                             >
//                               <SelectTrigger className="w-auto">
//                                 <Badge
//                                   className={getPriorityColor(
//                                     product.prioridad
//                                   )}
//                                 >
//                                   {product.prioridad}
//                                 </Badge>
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="baja">Baja</SelectItem>
//                                 <SelectItem value="media">Media</SelectItem>
//                                 <SelectItem value="alta">Alta</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </TableCell>
//                           <TableCell>
//                             <Select
//                               value={product.asignado || "unassigned"}
//                               onValueChange={(value: AssignOption) =>
//                                 updateProduct(product.id, {
//                                   asignado:
//                                     value === "unassigned"
//                                       ? undefined
//                                       : (value as (typeof USERS)[number]),
//                                 })
//                               }
//                             >
//                               <SelectTrigger className="w-auto">
//                                 <SelectValue placeholder="Sin asignar" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="unassigned">
//                                   Sin asignar
//                                 </SelectItem>
//                                 {USERS.map((user) => (
//                                   <SelectItem key={user} value={user}>
//                                     {user}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </TableCell>
//                           <TableCell>
//                             <Select
//                               value={product.estado}
//                               onValueChange={(value: typeof product.estado) =>
//                                 updateProduct(product.id, { estado: value })
//                               }
//                               disabled={product.estado === "Terminado"}
//                             >
//                               <SelectTrigger className="w-auto">
//                                 <Badge
//                                   className={getStateColor(product.estado)}
//                                 >
//                                   {product.estado}
//                                 </Badge>
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Pendiente">
//                                   Pendiente
//                                 </SelectItem>
//                                 <SelectItem value="En progreso">
//                                   En progreso
//                                 </SelectItem>
//                                 <SelectItem value="Terminado">
//                                   Terminado
//                                 </SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </TableCell>
//                           <TableCell>{product.creador}</TableCell>
//                           <TableCell>{product.fecha}</TableCell>
//                           <TableCell>
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size="icon">
//                                   <MoreHorizontal className="h-4 w-4" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent>
//                                 <DropdownMenuItem
//                                   onClick={() => setSelectedProduct(product)}
//                                 >
//                                   <Eye className="mr-2 h-4 w-4" />
//                                   Ver detalle
//                                 </DropdownMenuItem>
//                                 {product.estado !== "Terminado" && (
//                                   <DropdownMenuItem
//                                     onClick={() => setDeleteProduct(product)}
//                                   >
//                                     <Trash2 className="mr-2 h-4 w-4" />
//                                     Eliminar
//                                   </DropdownMenuItem>
//                                 )}
//                                 {product.estado === "Terminado" && (
//                                   <DropdownMenuItem
//                                     onClick={() =>
//                                       updateProduct(product.id, {
//                                         estado: "En progreso",
//                                       })
//                                     }
//                                   >
//                                     <Edit className="mr-2 h-4 w-4" />
//                                     Reabrir
//                                   </DropdownMenuItem>
//                                 )}
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </ScrollArea>

//                 {/* Pagination */}
//                 <div className="flex items-center justify-between space-x-2 py-4">
//                   <div className="flex items-center space-x-2">
//                     <p className="text-sm font-medium">Filas por página</p>
//                     <Select
//                       value={itemsPerPage.toString()}
//                       onValueChange={(value) => {
//                         setItemsPerPage(Number(value));
//                         setCurrentPage(1);
//                       }}
//                     >
//                       <SelectTrigger className="h-8 w-[70px]">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="10">10</SelectItem>
//                         <SelectItem value="25">25</SelectItem>
//                         <SelectItem value="50">50</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <p className="text-sm font-medium">
//                       Página {currentPage} de {totalPages}
//                     </p>
//                     <div className="flex items-center space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentPage((prev) => Math.max(prev - 1, 1))
//                         }
//                         disabled={currentPage === 1}
//                       >
//                         Anterior
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentPage((prev) =>
//                             Math.min(prev + 1, totalPages)
//                           )
//                         }
//                         disabled={currentPage === totalPages}
//                       >
//                         Siguiente
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Product Detail Dialog */}
//       <Dialog
//         open={!!selectedProduct}
//         onOpenChange={() => setSelectedProduct(null)}
//       >
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>{selectedProduct?.producto}</DialogTitle>
//             <DialogDescription>
//               Detalles del producto y historial de cambios
//             </DialogDescription>
//           </DialogHeader>

//           {selectedProduct && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label>Origen</Label>
//                   <Badge variant="outline">{selectedProduct.origen}</Badge>
//                 </div>
//                 <div>
//                   <Label>Estado</Label>
//                   <Badge className={getStateColor(selectedProduct.estado)}>
//                     {selectedProduct.estado}
//                   </Badge>
//                 </div>
//                 <div>
//                   <Label>Prioridad</Label>
//                   <Badge
//                     className={getPriorityColor(selectedProduct.prioridad)}
//                   >
//                     {selectedProduct.prioridad}
//                   </Badge>
//                 </div>
//                 <div>
//                   <Label>Asignado</Label>
//                   <p>{selectedProduct.asignado || "Sin asignar"}</p>
//                 </div>
//                 <div>
//                   <Label>Creador</Label>
//                   <p>{selectedProduct.creador}</p>
//                 </div>
//                 <div>
//                   <Label>Fecha</Label>
//                   <p>{selectedProduct.fecha}</p>
//                 </div>
//               </div>

//               {selectedProduct.precio && (
//                 <div>
//                   <Label>Precio</Label>
//                   <p>${selectedProduct.precio.toFixed(2)} UYU</p>
//                 </div>
//               )}

//               {selectedProduct.link && (
//                 <div>
//                   <Label>Link</Label>
//                   <a
//                     href={selectedProduct.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     {selectedProduct.link}
//                   </a>
//                 </div>
//               )}

//               {selectedProduct.comentario && (
//                 <div>
//                   <Label>Comentario</Label>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedProduct.comentario}
//                   </p>
//                 </div>
//               )}

//               <div>
//                 <Label>Historial de cambios</Label>
//                 <div className="space-y-2 mt-2">
//                   {selectedProduct.historial?.map((entry, index) => (
//                     <div key={index} className="flex justify-between text-sm">
//                       <span>{entry.cambio}</span>
//                       <span className="text-muted-foreground">
//                         {entry.usuario} - {entry.fecha}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={!!deleteProduct}
//         onOpenChange={() => setDeleteProduct(null)}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>¿Eliminar producto?</DialogTitle>
//             <DialogDescription>
//               Esta acción no se puede deshacer. El producto será eliminado
//               permanentemente.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteProduct(null)}>
//               Cancelar
//             </Button>
//             <Button variant="destructive" onClick={handleDeleteProduct}>
//               Eliminar
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import ProductsTabs from "@c/products/tabs/ProductsTabs";
import FiltersBar from "@c/products/filters/FiltersBar";
import ProductsTable from "@c/products/table/ProductsTable";
import EditTaskForm from "@/components/products/forms/EditTaskForm";

export default function ProductosPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,480px)_1fr] gap-4 p-4">
      <section className="space-y-4">
        <ProductsTabs />
        <EditTaskForm />
      </section>
      <section className="space-y-2">
        <FiltersBar />
        <ProductsTable />
      </section>
    </div>
  );
}
