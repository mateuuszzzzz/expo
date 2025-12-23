import { MCC_GROUPS, type MCCGroup } from './constants';
import type { TransactionData } from './EReceipt';

const MERCHANTS = [
  'Uber',
  'Starbucks',
  'Amazon',
  'Delta Airlines',
  'Marriott Hotel',
  'Shell Gas Station',
  'Whole Foods Market',
  'Netflix',
  'Spotify',
  'Apple Store',
  'Best Buy',
  'Target',
  'Walmart',
  'Costco',
  'Home Depot',
  'IKEA',
  'Chipotle',
  'McDonalds',
  'Subway',
  'Pizza Hut',
  'Hertz Car Rental',
  'Enterprise',
  'Lyft',
  'DoorDash',
  'Grubhub',
  'Instacart',
  'FedEx',
  'UPS',
  'USPS',
  'AT&T',
  'Verizon',
  'T-Mobile',
  'Con Edison',
  'National Grid',
  'Hilton',
  'Hyatt',
  'Airbnb',
  'Southwest Airlines',
  'United Airlines',
  'American Airlines',
];

const CARD_NAMES = [
  'Expensify Card ••••1234',
  'Expensify Card ••••5678',
  'Expensify Card ••••9012',
  'Expensify Card ••••3456',
  'Expensify Card ••••7890',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

function randomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomAmount(): number {
  // Random amount between $1.00 and $500.00 (in cents)
  return Math.floor(Math.random() * 50000) + 100;
}

function randomDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 365);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function generateTransactionID(): string {
  return `txn_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

export function generateMockTransaction(): TransactionData {
  return {
    transactionID: generateTransactionID(),
    amount: randomAmount(),
    currency: randomElement(CURRENCIES),
    merchant: randomElement(MERCHANTS),
    created: randomDate(),
    cardName: randomElement(CARD_NAMES),
    mccGroup: randomElement(MCC_GROUPS) as MCCGroup,
  };
}

export function generateMockTransactions(count: number): TransactionData[] {
  // Use a seeded random for consistent results
  const transactions: TransactionData[] = [];
  for (let i = 0; i < count; i++) {
    transactions.push({
      transactionID: `txn_${i}_${Math.random().toString(36).substring(2, 10)}`,
      amount: randomAmount(),
      currency: randomElement(CURRENCIES),
      merchant: randomElement(MERCHANTS),
      created: randomDate(),
      cardName: randomElement(CARD_NAMES),
      mccGroup: MCC_GROUPS[i % MCC_GROUPS.length] as MCCGroup,
    });
  }
  return transactions;
}
