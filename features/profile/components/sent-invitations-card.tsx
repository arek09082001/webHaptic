"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";
import type { SentInvitation } from "@/features/profile/hooks/use-invitations";

interface SentInvitationsCardProps {
  invitations: SentInvitation[];
  isLoading: boolean;
  isError: boolean;
}

export function SentInvitationsCard({
  invitations,
  isLoading,
  isError,
}: SentInvitationsCardProps) {
  const t = useTranslations();

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-3 text-sm font-medium text-text-secondary">{t("profile.sentInvitations")}</h2>

      {isLoading ? (
        <ul className="space-y-2">
          {[0, 1].map((i) => (
            <li key={i} className="rounded-xl border border-border p-3">
              <Skeleton className="mb-1.5 h-4 w-40 rounded" />
              <Skeleton className="mb-1 h-3 w-28 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <p className="text-sm text-red-500">{t("profile.failedToLoadInvitations")}</p>
      ) : invitations.length > 0 ? (
        <ul className="space-y-2">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="rounded-xl border border-border p-3 text-sm">
              <p className="font-medium">{invitation.email}</p>
              <p className="text-text-secondary">{formatDateTime(invitation.createdAt)}</p>
              <p className="text-xs text-text-secondary">{invitation.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-secondary">{t("profile.noSentInvitations")}</p>
      )}
    </section>
  );
}
