import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface SystemPromptTemplate {
  id: string;
  name: string;
  value: string;
  prompt_template_type_id: string | null;
  created_at: string;
  updated_at: string;
  prompt_template_type?: {
    name: string;
    description: string;
  };
}

interface PromptTemplateType {
  id: string;
  name: string;
  description: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  value: z.string().min(1, "Template value is required"),
  prompt_template_type_id: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const SystemPromptTemplates = () => {
  const [templates, setTemplates] = useState<SystemPromptTemplate[]>([]);
  const [types, setTypes] = useState<PromptTemplateType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SystemPromptTemplate | null>(null);
  const [deleteTemplate, setDeleteTemplate] = useState<SystemPromptTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
      prompt_template_type_id: "",
    },
  });

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('system_prompt_template')
        .select(`
          *,
          prompt_template_type:prompt_template_type_id (
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prompt templates",
        variant: "destructive",
      });
    }
  };

  const fetchTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_template_type')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTypes(data || []);
    } catch (error) {
      console.error('Error fetching types:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prompt template types",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTemplates(), fetchTypes()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        value: data.value,
        prompt_template_type_id: data.prompt_template_type_id || null,
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('system_prompt_template')
          .update(payload)
          .eq('id', editingTemplate.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Prompt template updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('system_prompt_template')
          .insert([payload]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Prompt template created successfully",
        });
      }

      await fetchTemplates();
      setIsDialogOpen(false);
      setEditingTemplate(null);
      form.reset();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save prompt template",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (template: SystemPromptTemplate) => {
    setEditingTemplate(template);
    form.reset({
      name: template.name,
      value: template.value,
      prompt_template_type_id: template.prompt_template_type_id || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTemplate) return;

    try {
      const { error } = await supabase
        .from('system_prompt_template')
        .delete()
        .eq('id', deleteTemplate.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prompt template deleted successfully",
      });

      await fetchTemplates();
      setDeleteTemplate(null);
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete prompt template",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    setEditingTemplate(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.prompt_template_type?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Prompt Templates</CardTitle>
          <CardDescription>
            Manage system prompt templates used throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTemplate ? "Edit Template" : "Create Template"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTemplate ? "Update the prompt template details." : "Create a new system prompt template."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter template name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="prompt_template_type_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">No type</SelectItem>
                              {types.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Value</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the prompt template content..."
                              className="min-h-[200px] resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingTemplate ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Template Preview</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No templates match your search." : "No templates found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        {template.name}
                      </TableCell>
                      <TableCell>
                        {template.prompt_template_type ? (
                          <Badge variant="secondary">
                            {template.prompt_template_type.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No type</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm text-muted-foreground">
                          {template.value}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(template.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTemplate(template)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTemplate} onOpenChange={() => setDeleteTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SystemPromptTemplates;