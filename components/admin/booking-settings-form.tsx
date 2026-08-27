"use client";

import { betterFetch } from "@better-fetch/fetch";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface BookingSettingsResponse {
  id: string;
  allowMultipleSlotsPerUser: boolean;
  maxSlotsPerUser: number | null;
  slotVisibility: string;
}

const VISIBILITY_OPTIONS = [
  {
    value: "full_public",
    label: "Full public",
    description: "Users see who booked each slot.",
  },
  {
    value: "availability_only",
    label: "Availability only",
    description:
      "Users see open vs taken hours, but never names. They still see their own bookings.",
  },
  {
    value: "admin_only",
    label: "Admin only",
    description:
      "Users don't see the slot list at all — admins assign every hour manually.",
  },
] as const;

export function BookingSettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [cap, setCap] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("availability_only");

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await betterFetch<BookingSettingsResponse>(
          "/api/admin/booking-settings",
        );
        if (error) throw error;
        if (data) {
          setAllowMultiple(data.allowMultipleSlotsPerUser);
          setCap(data.maxSlotsPerUser ? String(data.maxSlotsPerUser) : "");
          setVisibility(data.slotVisibility);
        }
      } catch (error) {
        console.error("Failed to load booking settings:", error);
        toast.error("Failed to load booking settings");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  async function save() {
    setIsSaving(true);
    try {
      const parsedCap = cap.trim() ? Number.parseInt(cap, 10) : null;
      if (
        allowMultiple &&
        parsedCap !== null &&
        (!Number.isInteger(parsedCap) || parsedCap < 1)
      ) {
        throw new Error("Slot cap must be a whole number of 1 or more");
      }

      const { data, error } = await betterFetch<BookingSettingsResponse>(
        "/api/admin/booking-settings",
        {
          method: "PUT",
          body: {
            allowMultipleSlotsPerUser: allowMultiple,
            maxSlotsPerUser: allowMultiple ? parsedCap : null,
            slotVisibility: visibility,
          },
        },
      );
      if (error) throw error;
      if (data) {
        setAllowMultiple(data.allowMultipleSlotsPerUser);
        setCap(data.maxSlotsPerUser ? String(data.maxSlotsPerUser) : "");
        setVisibility(data.slotVisibility);
      }
      toast.success("Bookings & slots settings saved");
    } catch (error) {
      console.error("Failed to save booking settings:", error);
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading settings…</p>;
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-base text-lg">
          <h2>Bookings and Slots</h2>
        </CardTitle>
        <CardDescription>
          Control how singers book worship hours on your events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <Label htmlFor="multiple-slots">
              Allow users to book multiple slots per event
            </Label>
            <p className="text-xs text-muted-foreground">
              When off, each user can hold one booked hour per event.
            </p>
          </div>
          <Switch
            id="multiple-slots"
            checked={allowMultiple}
            onCheckedChange={setAllowMultiple}
            className="cursor-pointer"
          />
        </div>

        {allowMultiple && (
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="slot-cap">Optional cap per user</Label>
            <Input
              id="slot-cap"
              type="number"
              min={1}
              placeholder="No limit"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for unlimited slots per user.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Label>Slot visibility to users</Label>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Choose visibility mode" />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground max-w-md">
            {
              VISIBILITY_OPTIONS.find((o) => o.value === visibility)
                ?.description
            }
          </p>
        </div>

        <Button onClick={save} disabled={isSaving} className="cursor-pointer">
          <Save className="mr-2 size-4" />
          {isSaving ? "Saving…" : "Save changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
