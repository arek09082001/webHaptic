export interface MonthlyExpense {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
  categoryName: string;
  createdBy: {
    name: string | null;
    email: string;
  };
}

export interface MonthlyExpenseCategory {
  id: string;
  name: string;
}

export interface MonthlyExpensesData {
  month: string;
  spent: number;
  categories: MonthlyExpenseCategory[];
  expenses: MonthlyExpense[];
}
