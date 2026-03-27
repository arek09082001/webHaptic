"use server";

import { cookies } from "next/headers";

export async function setLocaleCookie(locale: string) {
  if (locale !== "de" && locale !== "en") return;
  const cookieStore = await cookies();
  cookieStore.set("locale", locale, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
