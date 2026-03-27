"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddExpenseFormProps {
  isPending: boolean;
  isSuccess?: boolean;
  categoryId: string;
  onSubmit: (payload: { amount: number; description: string; categoryId: string }) => void;
}

export function AddExpenseForm({ isPending, isSuccess, categoryId, onSubmit }: AddExpenseFormProps) {
  const t = useTranslations();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isSuccess) return;
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 1500);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedAmount = Number(amount);
    const trimmedDescription = description.trim();

    if (!parsedAmount || parsedAmount <= 0 || !trimmedDescription) return;

    onSubmit({ amount: parsedAmount, description: trimmedDescription, categoryId });
    setAmount("");
    setDescription("");
  }

  return (
    <section
      className={`rounded-2xl border bg-surface p-4 transition-all duration-500 ${
        showSuccess
          ? "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.12)]"
          : "border-border"
      }`}
    >
      <h2 className="mb-3 text-sm font-medium text-text-secondary">{t("dashboard.addExpense")}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="amount"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          enterKeyHint="done"
          min="0.01"
          step="0.01"
          placeholder={t("dashboard.amountPlaceholder")}
          required
        />
        <Input
          name="description"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={120}
          placeholder={t("dashboard.descriptionPlaceholder")}
          required
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || showSuccess}
          style={showSuccess ? { background: "var(--color-success)", boxShadow: "0 4px 12px hsl(142 72% 29% / 0.35)" } : undefined}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2 animate-success-flash">
              <CheckCircle2 className="h-4 w-4" />
              {t("dashboard.expenseAdded")}
            </span>
          ) : isPending ? (
            t("dashboard.addingExpense")
          ) : (
            t("dashboard.addExpenseButton")
          )}
        </Button>
      </form>
    </section>
  );
}
