"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/theme-provider";
import { setLocaleCookie } from "@/app/actions/locale";
import { useTransition } from "react";

export function SettingsCard() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(newLocale: string) {
    startTransition(async () => {
      await setLocaleCookie(newLocale);
      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-1 text-lg font-semibold">{t("profile.settings")}</h2>
      <p className="mb-4 text-sm text-text-secondary">{t("profile.settingsSubtitle")}</p>

      <div className="space-y-4">
        {/* Theme */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("profile.theme")}</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                theme === "dark"
                  ? "bg-gradient-primary text-white"
                  : "bg-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("profile.themeDark")}
            </button>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                theme === "light"
                  ? "bg-gradient-primary text-white"
                  : "bg-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("profile.themeLight")}
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t("profile.language")}</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleLocaleChange("de")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                locale === "de"
                  ? "bg-gradient-primary text-white"
                  : "bg-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              DE
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleLocaleChange("en")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                locale === "en"
                  ? "bg-gradient-primary text-white"
                  : "bg-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
