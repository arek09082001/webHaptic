"use client";

import { InviteFormCard } from "@/features/profile/components/invite-form-card";
import { ProfileInfoCard } from "@/features/profile/components/profile-info-card";
import { ReceivedInvitationsCard } from "@/features/profile/components/received-invitations-card";
import { SentInvitationsCard } from "@/features/profile/components/sent-invitations-card";
import { SettingsCard } from "@/features/profile/components/settings-card";
import { CategoriesCard } from "@/features/profile/components/categories-card";
import {
  useAcceptInvitation,
  useInvitations,
  useSendInvitation,
} from "@/features/profile/hooks/use-invitations";

export function ProfilePage() {
  const { data, isLoading, isError } = useInvitations();
  const sendInvitation = useSendInvitation();
  const acceptInvitation = useAcceptInvitation();

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-text-primary">
      <div className="mx-auto w-full max-w-105 space-y-5">
        <ProfileInfoCard />
        <SettingsCard />
        <CategoriesCard />
        <InviteFormCard
          isPending={sendInvitation.isPending}
          onSubmit={(email) => sendInvitation.mutate(email)}
        />
        <ReceivedInvitationsCard
          invitations={data?.receivedInvitations ?? []}
          isLoading={isLoading}
          isError={isError}
          isAccepting={acceptInvitation.isPending}
          onAccept={(invitationId) => acceptInvitation.mutate(invitationId)}
        />
        <SentInvitationsCard
          invitations={data?.sentInvitations ?? []}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </main>
  );
}
