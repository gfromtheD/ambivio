"use server";

import { redirect } from "next/navigation";

import { deleteRoom } from "@/services/rooms";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

export async function listProperties() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, address, status, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No se pudieron cargar las propiedades.", { cause: error });
  }

  return data;
}

export async function getProperty(propertyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, address, status, created_at, updated_at")
    .eq("id", propertyId)
    .maybeSingle();

  if (error) {
    throw new Error("No se pudo cargar la propiedad.", { cause: error });
  }

  return data as PropertyRow | null;
}

export type PropertyFormState = {
  error: string | null;
};

export async function createPropertyAction(
  _prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!title) {
    return { error: "El título es obligatorio." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para crear una propiedad." };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return { error: "Tu cuenta no está asociada a una organización." };
  }

  const { data: property, error } = await supabase
    .from("properties")
    .insert({
      organization_id: profile.organization_id,
      title,
      address: address || null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "No se pudo crear la propiedad. Inténtalo de nuevo." };
  }

  redirect(`/properties/${property.id}`);
}

export async function updatePropertyAction(
  propertyId: string,
  _prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!title) {
    return { error: "El título es obligatorio." };
  }

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("properties")
    .update({
      title,
      address: address || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId)
    .select("id")
    .maybeSingle();

  if (error || !updated) {
    return { error: "No se pudo guardar la propiedad. Inténtalo de nuevo." };
  }

  redirect(`/properties/${propertyId}`);
}

export async function deletePropertyAction(
  propertyId: string,
  _prevState: PropertyFormState,
): Promise<PropertyFormState> {
  void _prevState;
  const supabase = await createClient();
  const { data: property, error: propertyError } = await supabase.from("properties").select("id").eq("id", propertyId).maybeSingle();
  if (propertyError || !property) return { error: "La propiedad no está disponible." };
  const { data: rooms, error: roomsError } = await supabase.from("rooms").select("id").eq("property_id", propertyId);
  if (roomsError) return { error: "No se pudieron revisar las habitaciones. Inténtalo de nuevo." };
  if (rooms?.length) {
    const { data: active, error: activeError } = await supabase.from("generations").select("id").in("room_id", rooms.map(room => room.id)).eq("status", "processing").limit(1);
    if (activeError || active?.length) return { error: "Espera a que termine la generación antes de eliminar la propiedad." };
    for (const room of rooms) {
      const result = await deleteRoom(room.id);
      if (result.error) return { error: result.error };
    }
  }
  const { error } = await supabase.rpc("delete_property", {
    p_property_id: propertyId,
  });

  if (error) {
    return {
      error: "No se pudo eliminar la propiedad. Inténtalo de nuevo.",
    };
  }

  redirect("/properties");
}