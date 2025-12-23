import { ERECEIPT_COLORS, type EReceiptColorName, type MCCGroup } from './constants';

// Background images
export const eReceiptBGs: Record<EReceiptColorName, number> = {
  [ERECEIPT_COLORS.YELLOW]: require('../../../assets/eReceipt/eReceiptBGs/eReceiptBG_yellow.svg'),
  [ERECEIPT_COLORS.ICE]: require('../../../assets/eReceipt/eReceiptBGs/eReceiptBG_ice.svg'),
  [ERECEIPT_COLORS.BLUE]: require('../../../assets/eReceipt/eReceiptBGs/eReceiptBG_blue.svg'),
  [ERECEIPT_COLORS.GREEN]: require('../../../assets/eReceipt/eReceiptBGs/eReceiptBG_green.svg'),
  [ERECEIPT_COLORS.TANGERINE]: require('../../../assets/eReceipt/eReceiptBGs/eReceiptBG_tangerine.svg'),
  [ERECEIPT_COLORS.PINK]: require('../../../assets/eReceipt/eReceiptBGs/eReceiptBG_pink.svg'),
};

// MCC Icons
export const MCCIcons: Record<MCCGroup, number> = {
  Airlines: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Airlines.svg'),
  Commuter: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Commuter.svg'),
  Gas: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Gas.svg'),
  Goods: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Goods.svg'),
  Groceries: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Groceries.svg'),
  Hotel: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Hotel.svg'),
  Mail: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Mail.svg'),
  Meals: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Meals.svg'),
  Miscellaneous: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Misc.svg'),
  Rental: require('../../../assets/eReceipt/MCCGroupIcons/MCC-RentalCar.svg'),
  Services: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Services.svg'),
  Taxi: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Taxi.svg'),
  Utilities: require('../../../assets/eReceipt/MCCGroupIcons/MCC-Utilities.svg'),
};

// Receipt body and wordmark
export const receiptBody = require('../../../assets/eReceipt/receipt-body.svg');
export const expensifyWordmark = require('../../../assets/eReceipt/expensify-wordmark.svg');
