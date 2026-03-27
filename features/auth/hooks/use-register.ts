import { useMutation } from "@tanstack/react-query";

interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

interface RegisterResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "");
  }

  return data;
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  });
}
