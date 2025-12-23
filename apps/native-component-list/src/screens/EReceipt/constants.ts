// eReceipt color constants matching Expensify
export const ERECEIPT_COLORS = {
  YELLOW: 'yellow',
  ICE: 'ice',
  BLUE: 'blue',
  GREEN: 'green',
  TANGERINE: 'tangerine',
  PINK: 'pink',
} as const;

export type EReceiptColorName = (typeof ERECEIPT_COLORS)[keyof typeof ERECEIPT_COLORS];

// Colors from Expensify theme
const colors = {
  yellow400: '#F4AB00',
  yellow500: '#D99E00',
  yellow800: '#3D2D00',
  ice400: '#4ED7DE',
  ice500: '#4DCFC6',
  ice800: '#062E2F',
  blue400: '#5EB2F8',
  blue500: '#59A6E8',
  blue800: '#002E60',
  green400: '#03D47C',
  green500: '#00B268',
  green800: '#002E22',
  tangerine400: '#FF8B3E',
  tangerine500: '#E07629',
  tangerine800: '#421800',
  pink400: '#F68DFE',
  pink500: '#DE6EE3',
  pink800: '#380039',
};

export const eReceiptColorStyles: Record<
  EReceiptColorName,
  { backgroundColor: string; color: string; titleColor: string }
> = {
  [ERECEIPT_COLORS.YELLOW]: {
    backgroundColor: colors.yellow800,
    color: colors.yellow400,
    titleColor: colors.yellow500,
  },
  [ERECEIPT_COLORS.ICE]: {
    backgroundColor: colors.ice800,
    color: colors.ice400,
    titleColor: colors.ice500,
  },
  [ERECEIPT_COLORS.BLUE]: {
    backgroundColor: colors.blue800,
    color: colors.blue400,
    titleColor: colors.blue500,
  },
  [ERECEIPT_COLORS.GREEN]: {
    backgroundColor: colors.green800,
    color: colors.green400,
    titleColor: colors.green500,
  },
  [ERECEIPT_COLORS.TANGERINE]: {
    backgroundColor: colors.tangerine800,
    color: colors.tangerine400,
    titleColor: colors.tangerine500,
  },
  [ERECEIPT_COLORS.PINK]: {
    backgroundColor: colors.pink800,
    color: colors.pink400,
    titleColor: colors.pink500,
  },
};

export const eReceiptColorsList: EReceiptColorName[] = [
  ERECEIPT_COLORS.YELLOW,
  ERECEIPT_COLORS.ICE,
  ERECEIPT_COLORS.BLUE,
  ERECEIPT_COLORS.GREEN,
  ERECEIPT_COLORS.TANGERINE,
  ERECEIPT_COLORS.PINK,
];

// Variables from Expensify
export const variables = {
  eReceiptBGHeight: 540,
  eReceiptBGHWidth: 335,
  eReceiptBodyHeight: 500,
  eReceiptBodyWidth: 295,
  eReceiptTextContainerWidth: 263,
  eReceiptMCCHeightWidthMedium: 32,
  eReceiptEmptyIconWidth: 64,
  eReceiptWordmarkWidth: 86,
  eReceiptWordmarkHeight: 20,
  eReceiptBackgroundImageMinWidth: 217,
  fontSizeEReceiptLarge: 44,
  fontSizeXXLarge: 28,
  fontSizeXLarge: 19,
  fontSizeSmall: 11,
  lineHeightXXLarge: 27,
  lineHeightSmall: 14,
  componentBorderRadiusNormal: 8,
};

// MCC Group types
export const MCC_GROUPS = [
  'Airlines',
  'Commuter',
  'Gas',
  'Goods',
  'Groceries',
  'Hotel',
  'Mail',
  'Meals',
  'Miscellaneous',
  'Rental',
  'Services',
  'Taxi',
  'Utilities',
] as const;

export type MCCGroup = (typeof MCC_GROUPS)[number];

// Hash function matching Expensify's hashText
export function hashText(text: string, range: number): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % range;
}

// Get color code based on transaction ID
export function getEReceiptColorCode(transactionID: string): EReceiptColorName {
  if (!transactionID) {
    return ERECEIPT_COLORS.YELLOW;
  }
  const colorHash = hashText(transactionID.trim(), eReceiptColorsList.length);
  return eReceiptColorsList[colorHash] ?? ERECEIPT_COLORS.YELLOW;
}
