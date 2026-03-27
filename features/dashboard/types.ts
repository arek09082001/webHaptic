export interface DashboardExpense {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface BudgetMember {
  id: string;
  email: string;
  name: string | null;
}

export interface BudgetInvitation {
  id: string;
  email: string;
  createdAt: string;
}

export interface PendingInvitationForMe {
  id: string;
  email: string;
  createdAt: string;
  budget: {
    month: string;
    user: {
      email: string;
      name: string | null;
    };
  };
}

export interface CategoryData {
  id: string;
  name: string;
  budget: {
    id: string;
    limitAmount: number;
  } | null;
  spent: number;
}

export interface DashboardData {
  month: string;
  categories: CategoryData[];
  pendingInvitationsForMe: PendingInvitationForMe[];
}
