import { apiGet } from "./client";
import type { PublicSettingsResponse } from "@/lib/types/settings";

export function getWhatsAppUrl(phone: string) {
  const internationalNumber = phone.replace(/\D/g, "");
  return `https://wa.me/${internationalNumber}`;
}

export async function getPublicSettings() {
  const response = await apiGet<PublicSettingsResponse>("/api/settings/public");
  return response.data;
}
