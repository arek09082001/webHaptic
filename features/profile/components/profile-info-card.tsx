"use client";

import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ProfileInfoCard() {
  const t = useTranslations();
  const { data: session } = useSession();

  const userName = session?.user?.name ?? t("profile.noName");
  const userEmail = session?.user?.email ?? t("profile.noEmail");

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h1 className="mb-2 text-lg font-semibold">{t("profile.title")}</h1>
      <p className="mb-4 text-sm text-text-secondary">{t("profile.subtitle")}</p>

      <div className="space-y-2 text-sm">
        <p>
          <span className="text-text-secondary">{t("profile.nameLabel")}: </span>
          <span className="font-medium">{userName}</span>
        </p>
        <p>
          <span className="text-text-secondary">{t("profile.emailLabel")}: </span>
          <span className="font-medium">{userEmail}</span>
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        {t("navigation.signOut")}
      </Button>
    </section>
  );
}
