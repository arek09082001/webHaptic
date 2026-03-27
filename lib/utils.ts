import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, locale = "de-DE", currency = "EUR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function getCurrentMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function shiftMonth(monthKey: string, step: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1 + step, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(monthKey: string, locale = "de-DE") {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

export function formatDate(dateInput: string | Date, locale = "de-DE") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateInput));
}

export function formatTime(dateInput: string | Date, locale = "de-DE") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateInput));
}

export function formatDateTime(dateInput: string | Date, locale = "de-DE") {
  return `${formatDate(dateInput, locale)} ${formatTime(dateInput, locale)}`;
}
