"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { betterFetch } from "@better-fetch/fetch";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/date-picker";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  poster: z.string().optional(),
  description: z.string().optional(),
  status: z.string(),
  ministers: z.array(
    z.object({
      name: z.string().min(1, "Minister name is required"),
      role: z.string().optional(),
      image: z.string().optional(),
    })
  ),
  sponsorIds: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: any;
}

export function EventForm({ isOpen, onClose, onSuccess, event }: EventFormProps) {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "published",
      ministers: [],
      sponsorIds: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ministers",
  });

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { data } = await betterFetch<any[]>("/api/sponsors");
        setSponsors(data || []);
      } catch (error) {
        console.error("Failed to fetch sponsors:", error);
      }
    };

    if (isOpen) {
      fetchSponsors();
      if (event) {
        reset({
          title: event.title,
          slug: event.slug,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          poster: event.poster || "",
          description: event.description || "",
          status: event.status,
          ministers: event.ministers || [],
          sponsorIds: event.sponsorIds || [],
        });
      } else {
        reset({
          title: "",
          slug: "",
          status: "published",
          ministers: [],
          sponsorIds: [],
        });
      }
    }
  }, [isOpen, event, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const url = event ? `/api/events/${event.id}` : "/api/events";
      const method = event ? "PATCH" : "POST";

      const { error } = await betterFetch(url, {
        method,
        body: values,
      });

      if (error) throw error;

      toast.success(event ? "Event updated" : "Event created");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
      toast.error("Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSponsors = watch("sponsorIds");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const toggleSponsor = (id: string) => {
    const current = [...selectedSponsors];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue("sponsorIds", current);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                date={startDate}
                setDate={(date) => setValue("startDate", date as Date)}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                date={endDate}
                setDate={(date) => setValue("endDate", date as Date)}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="poster">Poster URL</Label>
            <Input id="poster" {...register("poster")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={event?.status || "published"}
              onValueChange={(value) => setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Ministers</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", role: "", image: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Minister
              </Button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end border p-4 rounded-md relative">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input {...register(`ministers.${index}.name` as const)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input {...register(`ministers.${index}.role` as const)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL (Optional)</Label>
                      <Input {...register(`ministers.${index}.image` as const)} />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Sponsors</Label>
            <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sponsor-${sponsor.id}`}
                    checked={selectedSponsors.includes(sponsor.id)}
                    onCheckedChange={() => toggleSponsor(sponsor.id)}
                  />
                  <Label htmlFor={`sponsor-${sponsor.id}`}>{sponsor.name}</Label>
                </div>
              ))}
              {sponsors.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-3">
                  No sponsors found. Create some first.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
