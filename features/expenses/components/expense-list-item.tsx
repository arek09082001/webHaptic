"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { MonthlyExpense } from "../types";

interface ExpenseListItemProps {
  expense: MonthlyExpense;
  showCategory?: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (payload: { id: string; amount: number; description: string }) => void;
  onDelete: (id: string) => void;
}

export function ExpenseListItem({
  expense,
  showCategory = false,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete,
}: ExpenseListItemProps) {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(String(expense.amount));
  const [description, setDescription] = useState(expense.description);

  function handleCancel() {
    setAmount(String(expense.amount));
    setDescription(expense.description);
    setIsEditing(false);
  }

  function handleSave() {
    const parsedAmount = Number(amount);
    const trimmedDescription = description.trim();

    if (!parsedAmount || parsedAmount <= 0 || !trimmedDescription) {
      return;
    }

    onUpdate({
      id: expense.id,
      amount: parsedAmount,
      description: trimmedDescription,
    });

    setIsEditing(false);
  }

  function handleDelete() {
    onDelete(expense.id);
  }

  if (isEditing) {
    return (
      <li className="animate-slide-in rounded-lg border border-border bg-background px-3 py-2 text-sm">
        <div className="space-y-2">
          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            enterKeyHint="done"
            placeholder={t("dashboard.amountPlaceholder")}
          />
          <Input
            type="text"
            maxLength={120}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("dashboard.descriptionPlaceholder")}
          />
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              {t("common.cancel")}
            </Button>
            <Button type="button" size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? t("expenses.saving") : t("common.save")}
            </Button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="animate-slide-in flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="truncate">{expense.description}</p>
        <p className="text-xs text-text-secondary">{formatDate(expense.createdAt)}</p>
        <p className="text-xs text-text-secondary truncate">
          {expense.createdBy.name ?? expense.createdBy.email}
        </p>
        {showCategory && (
          <p className="mt-0.5 text-xs font-medium text-magenta truncate">{expense.categoryName}</p>
        )}
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2">
        <p className="font-medium tabular-nums">{formatCurrency(expense.amount)}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsEditing(true)}
          aria-label={t("expenses.edit")}
          title={t("expenses.edit")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={isDeleting ? t("common.deleting") : t("common.delete")}
          title={isDeleting ? t("common.deleting") : t("common.delete")}
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>
    </li>
  );
}
