import { Image } from 'expo-image';
import React, { createContext, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { eReceiptBGs, expensifyWordmark, MCCIcons, receiptBody } from './assets';
import {
  eReceiptColorStyles,
  getEReceiptColorCode,
  type MCCGroup,
  variables,
} from './constants';

// Context to control whether expo-image components are rendered
export const RenderImagesContext = createContext(true);

export type TransactionData = {
  transactionID: string;
  amount: number;
  currency: string;
  merchant: string;
  created: string;
  cardName: string;
  mccGroup: MCCGroup;
};

type EReceiptProps = {
  transaction: TransactionData;
};

function formatCurrency(amount: number, currency: string): { symbol: string; value: string } {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });

  const formatted = formatter.format(amount / 100);
  const symbol = formatted.replace(/[\d.,\s]/g, '').trim();
  const value = formatted.replace(symbol, '').trim();

  return { symbol, value };
}

// Icon component matching Expensify's Icon structure (adds extra View nesting)
function Icon({
  source,
  width,
  height,
  tintColor,
}: {
  source: number;
  width: number;
  height: number;
  tintColor?: string;
}) {
  const renderImages = useContext(RenderImagesContext);

  return (
    <View style={{ width, height }}>
      <View style={[StyleSheet.absoluteFill]}>
        {renderImages ? (
          <Image
            source={source}
            style={{ width, height }}
            contentFit="contain"
            tintColor={tintColor}
          />
        ) : (
          <View style={{ width, height, backgroundColor: tintColor || '#888' }} />
        )}
      </View>
    </View>
  );
}

// ImageSVG component matching Expensify's ImageSVG structure
function ImageSVG({
  source,
  style,
  tintColor,
  contentFit = 'cover',
}: {
  source: number;
  style?: any;
  tintColor?: string;
  contentFit?: 'cover' | 'contain' | 'fill';
}) {
  const renderImages = useContext(RenderImagesContext);

  if (!renderImages) {
    return (
      <View
        style={[{ width: '100%', height: '100%', backgroundColor: tintColor || '#444' }, style]}
      />
    );
  }

  return (
    <Image
      source={source}
      style={[{ width: '100%', height: '100%' }, style]}
      contentFit={contentFit}
      tintColor={tintColor}
    />
  );
}

export function EReceipt({ transaction }: EReceiptProps) {
  const colorCode = getEReceiptColorCode(transaction.transactionID);
  const colorStyles = eReceiptColorStyles[colorCode];
  const backgroundImage = eReceiptBGs[colorCode];
  const mccIcon = MCCIcons[transaction.mccGroup];

  const { symbol: currency, value: amount } = formatCurrency(
    transaction.amount,
    transaction.currency
  );

  // Structure matching Expensify's EReceipt.tsx exactly for View depth
  return (
    // Level 1: eReceiptContainer
    <View style={[styles.eReceiptContainer, { backgroundColor: colorStyles.backgroundColor }]}>
      {/* Level 2: flex1, overflowHidden, alignItemsCenter, justifyContentCenter */}
      <View
        style={[
          styles.flex1,
          styles.overflowHidden,
          styles.alignItemsCenter,
          styles.justifyContentCenter,
          { backgroundColor: colorStyles.backgroundColor },
        ]}>
        {/* Level 3: eReceiptBackgroundThumbnail */}
        <View style={styles.eReceiptBackgroundThumbnail}>
          <ImageSVG source={backgroundImage} />
        </View>

        {/* Level 3: eReceiptContentContainer */}
        <View style={styles.eReceiptContentContainer}>
          {/* Level 4 */}
          <View>
            {/* ReceiptBody ImageSVG */}
            <ImageSVG source={receiptBody} tintColor="#FFFFFF" contentFit="fill" />

            {/* Level 5: eReceiptContentWrapper */}
            <View style={styles.eReceiptContentWrapper}>
              {/* Level 6: white background container */}
              <View
                style={[
                  styles.h100,
                  styles.alignItemsCenter,
                  styles.justifyContentCenter,
                  { backgroundColor: '#FFFFFF' },
                ]}>
                {/* Level 7: MCC Icon container */}
                <View style={[styles.mccIconContainer, { backgroundColor: colorStyles.color }]}>
                  {/* Level 8 */}
                  <View>
                    {/* Level 9-10: Icon component */}
                    <Icon
                      source={mccIcon}
                      width={variables.eReceiptMCCHeightWidthMedium}
                      height={variables.eReceiptMCCHeightWidthMedium}
                      tintColor={colorStyles.backgroundColor}
                    />
                  </View>
                </View>

                {/* eReceipt guaranteed text */}
                <Text style={[styles.eReceiptGuaranteed, { color: colorStyles.color }]}>
                  eReceipt
                </Text>

                {/* Level 7: spacer */}
                <View style={styles.alignItemsCenter}>
                  {/* Level 8 */}
                  <View style={styles.iconSpacer} />
                </View>

                {/* Level 7: Main content flex column */}
                <View style={[styles.flexColumn, styles.justifyContentBetween, styles.alignItemsCenter, styles.ph9, styles.flex1]}>
                  {/* Level 8: Amount section */}
                  <View style={[styles.alignItemsCenter, styles.alignSelfCenter, styles.flexColumn, styles.gap2]}>
                    {/* Level 9: Amount row */}
                    <View style={[styles.flexRow, styles.justifyContentCenter, styles.amountRowWidth]}>
                      {/* Level 10: Currency container */}
                      <View style={[styles.flexColumn, styles.pt1]}>
                        {/* Level 11: Currency text */}
                        <Text style={[styles.eReceiptCurrency, { color: colorStyles.color }]}>
                          {currency}
                        </Text>
                      </View>
                      {/* Amount text */}
                      <Text
                        style={[styles.eReceiptAmountLarge, styles.pr4, { color: colorStyles.color }]}
                        adjustsFontSizeToFit
                        numberOfLines={1}>
                        {amount}
                      </Text>
                    </View>
                    {/* Merchant text */}
                    <Text
                      style={[styles.eReceiptMerchant, styles.textAlignCenter, { color: colorStyles.color }]}
                      numberOfLines={2}>
                      {transaction.merchant}
                    </Text>
                  </View>

                  {/* Level 8: Transaction details section */}
                  <View style={[styles.alignSelfStretch, styles.flexColumn, styles.gap4, styles.ph3]}>
                    {/* Level 9: Date row */}
                    <View style={[styles.flexColumn, styles.gap1]}>
                      {/* Level 10 */}
                      <Text style={[styles.eReceiptWaypointTitle, { color: colorStyles.titleColor }]}>
                        Transaction date
                      </Text>
                      <Text style={[styles.eReceiptWaypointAddress, { color: colorStyles.color }]}>
                        {transaction.created}
                      </Text>
                    </View>
                    {/* Level 9: Card row */}
                    <View style={[styles.flexColumn, styles.gap1]}>
                      {/* Level 10 */}
                      <Text style={[styles.eReceiptWaypointTitle, { color: colorStyles.titleColor }]}>
                        Card
                      </Text>
                      <Text style={[styles.eReceiptWaypointAddress, { color: colorStyles.color }]}>
                        {transaction.cardName}
                      </Text>
                    </View>
                  </View>

                  {/* Level 8: Wordmark section */}
                  <View>
                    {/* Level 9: Wordmark container */}
                    <View style={[styles.alignItemsCenter, styles.alignSelfStretch, styles.flexRow, styles.w100, styles.mb8]}>
                      {/* Level 10-11: Icon component for wordmark */}
                      <Icon
                        source={expensifyWordmark}
                        width={variables.eReceiptWordmarkWidth}
                        height={variables.eReceiptWordmarkHeight}
                        tintColor={colorStyles.color}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container styles
  eReceiptContainer: {
    width: variables.eReceiptBGHWidth,
    minHeight: variables.eReceiptBGHeight,
    overflow: 'hidden',
  },
  flex1: {
    flex: 1,
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  h100: {
    height: '100%',
  },
  w100: {
    width: '100%',
  },

  // Background
  eReceiptBackgroundThumbnail: {
    width: '100%',
    position: 'absolute',
    aspectRatio: 335 / 540,
    top: 0,
    minWidth: variables.eReceiptBackgroundImageMinWidth,
  },

  // Content container
  eReceiptContentContainer: {
    width: '100%',
    padding: 20,
    minWidth: variables.eReceiptBodyWidth,
    minHeight: variables.eReceiptBodyHeight,
  },
  eReceiptContentWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    height: '100%',
    position: 'absolute',
    left: 0,
  },

  // MCC Icon
  mccIconContainer: {
    width: variables.eReceiptEmptyIconWidth,
    height: variables.eReceiptEmptyIconWidth,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: variables.componentBorderRadiusNormal,
    marginBottom: 12,
  },

  // Text styles
  eReceiptGuaranteed: {
    fontFamily: 'monospace',
    fontSize: variables.fontSizeSmall,
    lineHeight: variables.lineHeightSmall,
  },
  eReceiptCurrency: {
    fontWeight: 'bold',
    fontSize: variables.fontSizeXXLarge,
  },
  eReceiptAmountLarge: {
    fontWeight: 'bold',
    fontSize: variables.fontSizeEReceiptLarge,
    textAlign: 'center',
  },
  eReceiptMerchant: {
    fontSize: variables.fontSizeXLarge,
    lineHeight: variables.lineHeightXXLarge,
  },
  eReceiptWaypointTitle: {
    fontSize: variables.fontSizeSmall,
    lineHeight: variables.lineHeightSmall,
  },
  eReceiptWaypointAddress: {
    fontFamily: 'monospace',
    fontSize: variables.fontSizeSmall,
    lineHeight: variables.lineHeightSmall,
  },

  // Layout helpers
  flexColumn: {
    flexDirection: 'column',
  },
  flexRow: {
    flexDirection: 'row',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignSelfStretch: {
    alignSelf: 'stretch',
  },
  textAlignCenter: {
    textAlign: 'center',
  },

  // Spacing
  iconSpacer: {
    width: 72,
    height: 40,
  },
  amountRowWidth: {
    width: variables.eReceiptTextContainerWidth,
  },
  gap1: {
    gap: 4,
  },
  gap2: {
    gap: 8,
  },
  gap4: {
    gap: 16,
  },
  ph3: {
    paddingHorizontal: 12,
  },
  ph9: {
    paddingHorizontal: 36,
  },
  pt1: {
    paddingTop: 4,
  },
  pr4: {
    paddingRight: 16,
  },
  mb8: {
    marginBottom: 32,
  },
});

export default EReceipt;
