"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRegisterMutation } from "@/features/auth/hooks/use-register";
import { useTranslations } from "next-intl";

export default function RegisterForm() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const registerMutation = useRegisterMutation();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError(t('auth.register.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('auth.register.passwordMinLength'));
      return;
    }

    try {
      await registerMutation.mutateAsync({
        email: email.toLowerCase(),
        password,
        name: name || undefined,
      });

      // Automatically sign in after successful registration
      const signInResult = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(t('auth.register.autoSignInFailed'));
      } else if (signInResult?.ok) {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('auth.register.genericError'));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto"></div>
          <p className="mt-4 text-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <div className="bg-surface shadow-2xl shadow-black/50 rounded-lg px-5 pt-6 pb-8 sm:px-8 border border-border">
          <h1 className="text-3xl font-bold text-center mb-2 text-gradient-primary">
            {t('auth.register.title')}
          </h1>
          <p className="text-center text-text-secondary mb-8 text-sm">
            {t('auth.register.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t('auth.register.nameOptional')}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent text-text-primary placeholder-text-muted"
                placeholder={t('auth.register.namePlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t('common.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent text-text-primary placeholder-text-muted"
                placeholder={t('auth.fields.emailPlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t('common.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent text-text-primary placeholder-text-muted"
                placeholder={t('auth.fields.passwordPlaceholder')}
              />
              <p className="text-xs text-text-muted mt-1">
                {t('auth.register.passwordHint')}
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t('auth.register.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent text-text-primary placeholder-text-muted"
                placeholder={t('auth.fields.passwordPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full px-6 py-3 bg-magenta text-white font-medium rounded-lg shadow-sm hover:bg-magenta/90 transition focus:outline-none focus:ring-2 focus:ring-magenta focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? t('auth.register.submitting') : t('auth.register.submit')}
            </button>
          </form>

          <p className="text-center text-text-muted text-xs mt-6">
            {t('auth.register.legal')}
          </p>
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              {t('auth.register.hasAccount')}{" "}
              <Link
                href="/login"
                className="text-magenta hover:text-cyan transition font-medium"
              >
                {t('auth.register.signInLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
