import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const INVITATIONS_KEY = ["budget-invitations"] as const;

export interface SentInvitation {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  acceptedAt: string | null;
}

export interface ReceivedInvitation {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  acceptedAt: string | null;
  budget: {
    month: string;
    user: {
      name: string | null;
      email: string;
    };
  };
}

export interface InvitationsData {
  month: string;
  sentInvitations: SentInvitation[];
  receivedInvitations: ReceivedInvitation[];
}

async function fetchInvitations(): Promise<InvitationsData> {
  const res = await fetch("/api/budget/invitations");
  if (!res.ok) throw new Error("Failed to load invitations");
  return res.json();
}

export function useInvitations() {
  return useQuery<InvitationsData>({
    queryKey: INVITATIONS_KEY,
    queryFn: fetchInvitations,
  });
}

async function sendInvitation(email: string) {
  const res = await fetch("/api/budget/invitations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to send invitation");
  }

  return res.json();
}

export function useSendInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATIONS_KEY });
    },
  });
}

async function acceptInvitation(invitationId: string) {
  const res = await fetch(`/api/budget/invitations/${invitationId}/accept`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to accept invitation");
  }

  return res.json();
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATIONS_KEY });
    },
  });
}
