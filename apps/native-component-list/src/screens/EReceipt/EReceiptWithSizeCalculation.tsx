import React, { useState } from 'react';
import { View, StyleSheet, type LayoutChangeEvent } from 'react-native';

import { variables } from './constants';
import EReceipt, { type TransactionData } from './EReceipt';

type EReceiptWithSizeCalculationProps = {
  transaction: TransactionData;
};

/**
 * Wrapper component matching Expensify's EReceiptWithSizeCalculation
 * This adds:
 * - useState for scaleFactor (causes re-render after onLayout)
 * - onLayout callback
 * - transform: scale()
 * - Additional View nesting
 */
function EReceiptWithSizeCalculation({ transaction }: EReceiptWithSizeCalculationProps) {
  const [scaleFactor, setScaleFactor] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setScaleFactor(width / variables.eReceiptBGHWidth);
    }
  };

  // First render: empty View with onLayout to calculate scale
  // Second render: scaled EReceipt
  return scaleFactor > 0 ? (
    <View style={styles.container}>
      <View
        onLayout={onLayout}
        style={[
          styles.scaledContainer,
          {
            transform: [{ scale: scaleFactor }],
            width: variables.eReceiptBGHWidth,
            height: variables.eReceiptBGHeight,
          },
        ]}>
        <EReceipt transaction={transaction} />
      </View>
    </View>
  ) : (
    <View style={styles.measureContainer} onLayout={onLayout} />
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  scaledContainer: {
    transformOrigin: 'top left',
  },
  measureContainer: {
    width: '100%',
    height: '100%',
  },
});

export default EReceiptWithSizeCalculation;
