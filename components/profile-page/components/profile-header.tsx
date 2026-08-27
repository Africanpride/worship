"use client";

import { format } from "date-fns";
import { Calendar, Camera, Mail, MapPin, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProfileRecord, ProfileUser } from "../types";

interface ProfileHeaderProps {
  user: ProfileUser;
  profile: ProfileRecord;
}

export default function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | undefined>(profile.avatarUrl || user.image || undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const joinedDate = user.createdAt ? new Date(user.createdAt) : new Date();
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "??";
  const isVolunteer =
    profile.volunteerAreas && profile.volunteerAreas.length > 0;
  const avatarSrc = localAvatar || profile.avatarUrl || user.image || undefined;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 1 * 1024 * 1024) {
      toast.error("Max 1MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const upload = async () => {
    if (!file) {
      toast.error("Pick an image first");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");
      const url: string = json.url;
      const patch = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: url }),
      });
      if (!patch.ok) throw new Error("Save failed");
      setLocalAvatar(url);
      toast.success("Profile picture updated");
      setOpen(false);
      setFile(null);
      setPreview(null);
      mutate("/api/profile");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  };
  const remove = async () => {
    setUploading(true);
    try {
      const r = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: "" }),
      });
      if (!r.ok) throw new Error("Remove failed");
      setLocalAvatar(user.image || undefined);
      toast.success("Profile picture removed");
      setOpen(false);
      setPreview(null);
      setFile(null);
      mutate("/api/profile");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-primary/5 via-background to-background p-2 md:p-4 w-full">
      <CardContent className="p-0">
        <div className="relative h-32 w-full bg-gradient-to-r from-primary/20 to-primary/5 md:h-40 overflow-hidden">
          {profile.bannerUrl && (
            <Image
              src={profile.bannerUrl}
              alt="Banner"
              fill
              sizes="100vw"
              className="object-cover opacity-50"
            />
          )}
        </div>
        <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6 md:flex-row md:items-end md:gap-8 -mt-12 md:-mt-16">
          {/* Avatar with Dialog trigger */}
          <Dialog open={open} onOpenChange={setOpen}>
            <div className="relative group shrink-0">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl md:h-32 md:w-32">
                <AvatarImage src={avatarSrc} alt={user.name} />
                <AvatarFallback className="text-3xl font-bold bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-0 bottom-0 h-9 w-9 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Change Profile Picture"
                >
                  <Camera className="size-4" />
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change profile picture</DialogTitle>
                <DialogDescription>
                  JPG/PNG/WebP, max 1MB. 512×512 face crop.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="size-32 overflow-hidden rounded-full border bg-muted">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt="Preview"
                        className="size-full object-cover"
                      />
                    ) : avatarSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarSrc}
                        alt={user.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-2xl font-bold text-muted-foreground">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={onFileChange}
                />
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="cursor-pointer"
                  >
                    Choose image
                  </Button>
                  <Button
                    type="button"
                    onClick={upload}
                    disabled={uploading || !file}
                    className="cursor-pointer"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />{" "}
                        Uploading…
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
                {avatarSrc && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={remove}
                      disabled={uploading}
                      className="cursor-pointer text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 size-4" /> Remove photo
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2 pt-1 md:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl text-foreground sm:text-3xl">
                {user.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="default"
                  className="bg-primary text-primary-foreground font-semibold px-3 uppercase tracking-wider text-[10px]"
                >
                  {profile.membershipPlan || "Basic"}
                </Badge>
                {isVolunteer && (
                  <Badge
                    variant="secondary"
                    className="font-medium uppercase tracking-wider text-[10px]"
                  >
                    Volunteer
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-base font-medium text-primary/80 truncate">
              {profile.jobTitle || "Member"}{" "}
              {profile.company ? ` at ${profile.company}` : ""}
            </p>
            <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
              <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer min-w-0">
                <Mail className="size-4 text-primary shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {profile.location && (
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                  <MapPin className="size-4 text-primary shrink-0" />
                  {profile.location}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary shrink-0" />
                Joined {format(joinedDate, "MMMM yyyy")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
