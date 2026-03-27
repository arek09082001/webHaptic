"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InviteFormCardProps {
  isPending: boolean;
  onSubmit: (email: string) => void;
}

export function InviteFormCard({ isPending, onSubmit }: InviteFormCardProps) {
  const t = useTranslations();
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }

    onSubmit(normalizedEmail);
    setEmail("");
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-3 text-sm font-medium text-text-secondary">{t("profile.sendInvitation")}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("profile.inviteEmailPlaceholder")}
          required
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t("profile.sendingInvitation") : t("profile.sendInvitation")}
        </Button>
      </form>
    </section>
  );
}
