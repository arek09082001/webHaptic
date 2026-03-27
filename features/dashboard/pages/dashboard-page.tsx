"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useDashboard,
  useSetCategoryLimit,
  useAddExpense,
} from "@/features/dashboard/hooks/use-dashboard";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { SetLimitForm } from "@/features/dashboard/components/set-limit-form";
import { AddExpenseForm } from "@/features/dashboard/components/add-expense-form";
import { CategorySlide } from "@/features/dashboard/components/category-slide";
import { InsightsPanel } from "@/features/dashboard/components/insights-panel";
import { ForecastPanel } from "@/features/dashboard/components/forecast-panel";
import { useInsightsForecast } from "@/features/dashboard/hooks/use-insights-forecast";
import { Carousel } from "@/components/ui/carousel";

export function DashboardPage() {
  const t = useTranslations();
  const { status } = useSession();
  const router = useRouter();

  const { data, isLoading, isError } = useDashboard();
  const setLimit = useSetCategoryLimit();
  const addExpense = useAddExpense();
  const { insights, forecast } = useInsightsForecast();

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500 text-sm">{t("dashboard.failedToLoad")}</p>
      </main>
    );
  }

  if (!data) return null;

  const { month, categories } = data;
  const activeCategory = categories[activeIndex] ?? categories[0];

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background px-4 py-6 text-text-primary md:min-h-screen">
      <div className="mx-auto w-full max-w-105 space-y-5">
        {/* Category carousel */}
        <Carousel onSlideChange={setActiveIndex}>
          {categories.map((category) => (
            <CategorySlide key={category.id} category={category} month={month} />
          ))}
        </Carousel>

        {/* Form — stays fixed below carousel, bound to active category */}
        {activeCategory && (
          activeCategory.budget === null ? (
            <SetLimitForm
              isPending={setLimit.isPending}
              categoryId={activeCategory.id}
              onSubmit={(payload) => setLimit.mutate(payload)}
            />
          ) : (
            <AddExpenseForm
              isPending={addExpense.isPending}
              isSuccess={addExpense.isSuccess}
              categoryId={activeCategory.id}
              onSubmit={(payload) => addExpense.mutate(payload)}
            />
          )
        )}

        {/* Smart Insights */}
        <InsightsPanel insights={insights} />

        {/* Budget Forecast */}
        {forecast && <ForecastPanel forecast={forecast} />}
      </div>
    </main>
  );
}
