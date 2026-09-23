export interface Income {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	type: string;
	amount: number;
	deductions?: number;
	recurrence: 'unique' | 'monthly';
	period: 'specific' | 'monthly';
	paymentDays: number[];
	month?: number;
}

export type IncomePaymentStatus = 'received' | 'pending' | 'partial';
export type IncomeKindFilter = 'all' | 'fixed' | 'variable';
export type IncomeStatusFilter = 'all' | IncomePaymentStatus;

export interface IncomeWithStatus extends Income {
	status: IncomePaymentStatus;
	net: number;
	appliesToMonth: boolean;
}

export interface IncomeSummary {
	projectedMonthly: number;
	activeSources: number;
	receivedThisMonth: number;
	pendingThisMonth: number;
	receivedPercent: number;
	fixedAmount: number;
	variableAmount: number;
	fixedPercent: number;
	variablePercent: number;
	grossTotal: number;
	deductionsTotal: number;
	netTotal: number;
}

export interface IncomeFilters {
	search: string;
	kind: IncomeKindFilter;
	status: IncomeStatusFilter;
}

export interface IncomeFormValues {
	name: string;
	type: string;
	amount: number;
	deductions?: number;
	recurrence: Income['recurrence'];
	period: Income['period'];
	paymentDays: number[];
	month?: number;
}

export const incomeSeed: Income[] = [
	{ id: 'income-1', createdAt: new Date('2026-01-05T12:00:00'), updatedAt: new Date('2026-01-05T12:00:00'), name: 'Salario Empresa X', type: 'Salary', amount: 6800000, deductions: 800000, recurrence: 'monthly', period: 'monthly', paymentDays: [30] },
	{ id: 'income-2', createdAt: new Date('2026-02-10T12:00:00'), updatedAt: new Date('2026-02-10T12:00:00'), name: 'Prima', type: 'Consulting', amount: 3400000, deductions: 0, recurrence: 'unique', period: 'specific', paymentDays: [15], month : 12 },
];
export type IncomeFormMode = 'create' | 'edit';
