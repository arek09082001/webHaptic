"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  itemName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export default function DeleteConfirmDialog({
  title,
  description,
  itemName,
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBusy = loading || isLoading;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      console.error('Delete failed:', err);
      setError(t('common.deleteFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isBusy) {
      setError(null);
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🗑️ {title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {itemName && (
            <div className="bg-surface border border-border rounded-lg p-3 mb-4">
              <p className="text-text-secondary text-sm">{t('dialog.delete.itemLabel')}</p>
              <p className="text-text-primary font-semibold break-words">{itemName}</p>
            </div>
          )}
          <div className="bg-magenta/10 border border-magenta/30 rounded-lg p-3">
            <p className="text-magenta text-sm">
              ⚠️ {t('dialog.delete.warning')}
            </p>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </DialogBody>

        <DialogFooter>
          <button
            onClick={() => handleOpenChange(false)}
            disabled={isBusy}
            className="px-6 py-3 border border-border-light text-text-primary rounded-md hover:bg-surface-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isBusy}
            className="px-6 py-3 bg-magenta text-white rounded-md hover:bg-magenta/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy ? `⏳ ${t('common.deleting')}` : `🗑️ ${t('common.delete')}`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
