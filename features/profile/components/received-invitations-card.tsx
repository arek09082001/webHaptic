"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";
import type { ReceivedInvitation } from "@/features/profile/hooks/use-invitations";

interface ReceivedInvitationsCardProps {
  invitations: ReceivedInvitation[];
  isLoading: boolean;
  isError: boolean;
  isAccepting: boolean;
  onAccept: (invitationId: string) => void;
}

export function ReceivedInvitationsCard({
  invitations,
  isLoading,
  isError,
  isAccepting,
  onAccept,
}: ReceivedInvitationsCardProps) {
  const t = useTranslations();

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-3 text-sm font-medium text-text-secondary">{t("profile.receivedInvitations")}</h2>

      {isLoading ? (
        <ul className="space-y-2">
          {[0, 1].map((i) => (
            <li key={i} className="rounded-xl border border-border p-3">
              <Skeleton className="mb-1.5 h-4 w-32 rounded" />
              <Skeleton className="mb-1 h-3 w-20 rounded" />
              <Skeleton className="mb-2 h-3 w-28 rounded" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-14 rounded" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </li>
          ))}
        </ul>
      ) : isError ? (
        <p className="text-sm text-red-500">{t("profile.failedToLoadInvitations")}</p>
      ) : invitations.length > 0 ? (
        <ul className="space-y-2">
          {invitations.map((invitation) => {
            const isPending = invitation.status === "PENDING";
            return (
              <li key={invitation.id} className="rounded-xl border border-border p-3 text-sm">
                <p className="font-medium">{invitation.budget.user.name ?? invitation.budget.user.email}</p>
                <p className="text-text-secondary">{invitation.budget.month}</p>
                <p className="text-text-secondary">{formatDateTime(invitation.createdAt)}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-text-secondary">{invitation.status}</span>
                  {isPending ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onAccept(invitation.id)}
                      disabled={isAccepting}
                    >
                      {isAccepting ? t("profile.acceptingInvitation") : t("profile.acceptInvitation")}
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-text-secondary">{t("profile.noReceivedInvitations")}</p>
      )}
    </section>
  );
}
