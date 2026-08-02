import type { Metadata } from "next";
import { VolunteerManagement } from "@/components/admin/volunteer-management";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Volunteer Management",
	description: "View and manage all volunteers for The Non-Stop Series™.",
};

export default function VolunteersPage() {
	return <VolunteerManagement />;
}
