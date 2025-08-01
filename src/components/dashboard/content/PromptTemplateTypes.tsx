import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, CalendarIcon, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

type PromptTemplateType = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function PromptTemplateTypes() {
  const [types, setTypes] = useState<PromptTemplateType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<PromptTemplateType | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("prompt_template_type")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching prompt template types:", error);
        toast({
          title: "Error",
          description: "Failed to fetch prompt template types",
          variant: "destructive",
        });
        return;
      }

      setTypes(data || []);
    } catch (error) {
      console.error("Error in fetchTypes:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);

      const payload = {
        name: data.name,
        description: data.description || null,
      };

      if (editingType) {
        const { error } = await supabase
          .from("prompt_template_type")
          .update(payload)
          .eq("id", editingType.id);

        if (error) {
          console.error("Error updating prompt template type:", error);
          toast({
            title: "Error",
            description: "Failed to update prompt template type",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Prompt template type updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("prompt_template_type")
          .insert([payload]);

        if (error) {
          console.error("Error creating prompt template type:", error);
          toast({
            title: "Error",
            description: "Failed to create prompt template type",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Prompt template type created successfully",
        });
      }

      await fetchTypes();
      handleCloseDialog();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (type: PromptTemplateType) => {
    setEditingType(type);
    form.reset({
      name: type.name,
      description: type.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("prompt_template_type")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting prompt template type:", error);
        toast({
          title: "Error",
          description: "Failed to delete prompt template type",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Prompt template type deleted successfully",
      });

      await fetchTypes();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingType(null);
    form.reset();
  };

  const handleNewType = () => {
    setEditingType(null);
    form.reset({
      name: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const clearDateRange = () => {
    setDateRange(undefined);
  };

  // Filter types based on date range
  const filteredTypes = types.filter((type) => {
    if (!dateRange?.from) return true;
    
    const typeDate = new Date(type.created_at);
    const fromDate = dateRange.from;
    const toDate = dateRange.to || dateRange.from;
    
    // Set time to start/end of day for proper comparison
    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    
    return typeDate >= start && typeDate <= end;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Template Types</h1>
          <p className="text-muted-foreground">Manage categories for organizing prompt templates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewType} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Template Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingType ? "Edit Template Type" : "Create New Template Type"}
              </DialogTitle>
              <DialogDescription>
                {editingType
                  ? "Update the template type details below."
                  : "Create a new template type to categorize your prompt templates."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template type name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter description (optional)" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting 
                      ? (editingType ? "Updating..." : "Creating...") 
                      : (editingType ? "Update" : "Create")
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Filter by date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {dateRange?.from && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDateRange}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {dateRange?.from && (
          <Badge variant="secondary" className="text-xs">
            {filteredTypes.length} of {types.length} results
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Types</CardTitle>
          <CardDescription>
            All prompt template types in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTypes.length === 0 ? (
            types.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No template types found.</p>
              <Button
                onClick={handleNewType}
                variant="outline"
                className="mt-4"
              >
                Create your first template type
              </Button>
            </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No template types found for the selected date range.</p>
                <Button
                  onClick={clearDateRange}
                  variant="outline"
                  className="mt-4"
                >
                  Clear date filter
                </Button>
              </div>
            )
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>
                      {type.description ? (
                        <span className="text-sm text-muted-foreground">
                          {type.description.length > 100
                            ? `${type.description.substring(0, 100)}...`
                            : type.description}
                        </span>
                      ) : (
                        <Badge variant="secondary">No description</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(type.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(type)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                template type "{type.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(type.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}