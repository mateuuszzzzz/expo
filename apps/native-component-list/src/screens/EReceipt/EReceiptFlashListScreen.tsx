import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { variables } from './constants';
import type { TransactionData } from './EReceipt';
import EReceiptWithSizeCalculation from './EReceiptWithSizeCalculation';
import { generateMockTransactions } from './mockData';

const WINDOW_SIZE = Dimensions.get('window');
const COLUMNS_COUNT = 2;
const ITEM_WIDTH = variables.eReceiptBGHWidth;
const ITEM_HEIGHT = variables.eReceiptBGHeight;
const SCALE = Math.min(1, (WINDOW_SIZE.width / COLUMNS_COUNT - 16) / ITEM_WIDTH);

const LIST_SIZE_OPTIONS = [250, 500, 750, 1000] as const;
type ListSize = (typeof LIST_SIZE_OPTIONS)[number];

/**
 * EReceiptItem - matches Expensify's structure with:
 * - EReceiptWithSizeCalculation (useState + onLayout + transform scale)
 * - Deep View nesting (~11+ levels)
 * - 4 expo-image instances per item
 */
function EReceiptItem({ item }: { item: TransactionData }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemInner}>
        <EReceiptWithSizeCalculation transaction={item} />
      </View>
    </View>
  );
}

function renderItem({ item }: ListRenderItemInfo<TransactionData>) {
  return <EReceiptItem item={item} />;
}

function keyExtractor(item: TransactionData) {
  return item.transactionID;
}

export default function EReceiptFlashListScreen() {
  const [listSize, setListSize] = useState<ListSize>(250);

  const transactions = useMemo(() => generateMockTransactions(listSize), [listSize]);

  return (
    <View style={styles.root}>
      {/* List Size Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Number of eReceipts:</Text>
        <View style={styles.buttonRow}>
          {LIST_SIZE_OPTIONS.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeButton, listSize === size && styles.sizeButtonActive]}
              onPress={() => setListSize(size)}>
              <Text style={[styles.sizeButtonText, listSize === size && styles.sizeButtonTextActive]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* eReceipt List */}
      <FlashList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={COLUMNS_COUNT}
        estimatedItemSize={ITEM_HEIGHT * SCALE + 16}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  selectorContainer: {
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  selectorLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3A3A3A',
  },
  sizeButtonActive: {
    backgroundColor: '#03D47C',
  },
  sizeButtonText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
  },
  sizeButtonTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 8,
  },
  itemContainer: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
  },
  itemInner: {
    width: ITEM_WIDTH * SCALE,
    height: ITEM_HEIGHT * SCALE,
  },
});

EReceiptFlashListScreen.navigationOptions = {
  title: 'eReceipt FlashList',
};
