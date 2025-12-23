import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
} from 'react-native';

import { variables } from './constants';
import { RenderImagesContext, type TransactionData } from './EReceipt';
import EReceiptWithSizeCalculation from './EReceiptWithSizeCalculation';
import { generateMockTransactions } from './mockData';

const WINDOW_SIZE = Dimensions.get('window');

// Receipt carousel dimensions (matching Expensify)
const RECEIPT_WIDTH = 180;
const RECEIPT_HEIGHT = 290;

// Message list options
const MESSAGE_COUNT_OPTIONS = [10, 25, 50, 100] as const;
const RECEIPTS_PER_MESSAGE_OPTIONS = [3, 5, 9, 10] as const; // Max 10 like Expensify

type MessageCountOption = (typeof MESSAGE_COUNT_OPTIONS)[number];
type ReceiptsPerMessageOption = (typeof RECEIPTS_PER_MESSAGE_OPTIONS)[number];

type MessageData = {
  id: string;
  userName: string;
  timestamp: string;
  reportName: string;
  transactions: TransactionData[];
  totalAmount: number;
};

function generateMockMessages(
  messageCount: number,
  receiptsPerMessage: number
): MessageData[] {
  const messages: MessageData[] = [];

  for (let i = 0; i < messageCount; i++) {
    const transactions = generateMockTransactions(receiptsPerMessage).map((t, idx) => ({
      ...t,
      transactionID: `msg_${i}_txn_${idx}_${t.transactionID}`,
    }));

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    messages.push({
      id: `message_${i}`,
      userName: `User ${i + 1}`,
      timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
      reportName: `Expense Report #${1000 + i}`,
      transactions,
      totalAmount,
    });
  }

  return messages;
}

// ============================================================
// Component hierarchy matching Expensify:
// ReportActionItemImage -> ReceiptImage -> EReceiptWithSizeCalculation -> EReceipt
// ============================================================

/**
 * Level 4: ReceiptImage (matches src/components/ReceiptImage/index.tsx)
 * Wraps EReceiptWithSizeCalculation
 */
function ReceiptImage({ transaction }: { transaction: TransactionData }) {
  return (
    <View style={receiptImageStyles.container}>
      <EReceiptWithSizeCalculation transaction={transaction} />
    </View>
  );
}

const receiptImageStyles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

/**
 * Level 3: ReportActionItemImage (matches src/components/ReportActionItem/ReportActionItemImage.tsx)
 * Wraps ReceiptImage with additional View layers
 */
function ReportActionItemImage({ transaction }: { transaction: TransactionData }) {
  return (
    <View style={reportActionItemImageStyles.container}>
      <View style={reportActionItemImageStyles.inner}>
        <ReceiptImage transaction={transaction} />
      </View>
    </View>
  );
}

const reportActionItemImageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});

/**
 * Level 2: ReportActionItemImages (matches src/components/ReportActionItem/ReportActionItemImages.tsx)
 * Container for multiple images with border handling
 */
function ReportActionItemImages({ transaction }: { transaction: TransactionData }) {
  return (
    <View style={reportActionItemImagesStyles.container}>
      <View style={reportActionItemImagesStyles.imagesRow}>
        <View style={reportActionItemImagesStyles.imageWrapper}>
          <ReportActionItemImage transaction={transaction} />
        </View>
      </View>
    </View>
  );
}

const reportActionItemImagesStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
  imagesRow: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 8,
    flex: 1,
  },
  imageWrapper: {
    flex: 1,
  },
});

/**
 * Level 1: TransactionPreviewContent (matches src/components/ReportActionItem/TransactionPreview/TransactionPreviewContent.tsx)
 * Full transaction preview with receipt image and details
 */
function TransactionPreviewContent({ transaction }: { transaction: TransactionData }) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: transaction.currency,
  }).format(transaction.amount / 100);

  return (
    <View style={transactionPreviewStyles.container}>
      {/* Receipt image section */}
      <View style={transactionPreviewStyles.receiptSection}>
        <ReportActionItemImages transaction={transaction} />
      </View>

      {/* Transaction details */}
      <View style={transactionPreviewStyles.detailsSection}>
        <Text style={transactionPreviewStyles.dateText}>
          {transaction.created} · Card · Pending
        </Text>
        <View style={transactionPreviewStyles.amountRow}>
          <Text style={transactionPreviewStyles.merchantText} numberOfLines={1}>
            {transaction.merchant}
          </Text>
          <Text style={transactionPreviewStyles.amountText}>{formattedAmount}</Text>
        </View>
        <View style={transactionPreviewStyles.categoryRow}>
          <View style={transactionPreviewStyles.categoryIcon} />
          <Text style={transactionPreviewStyles.categoryText} numberOfLines={1}>
            {transaction.mccGroup}
          </Text>
        </View>
      </View>
    </View>
  );
}

const transactionPreviewStyles = StyleSheet.create({
  container: {
    backgroundColor: '#0D3D38',
    borderRadius: 12,
    overflow: 'hidden',
    width: RECEIPT_WIDTH,
  },
  receiptSection: {
    height: 180,
    overflow: 'hidden',
  },
  detailsSection: {
    padding: 8,
    gap: 4,
  },
  dateText: {
    color: '#888888',
    fontSize: 10,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  merchantText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#555555',
    borderRadius: 2,
  },
  categoryText: {
    color: '#888888',
    fontSize: 10,
    flex: 1,
  },
  violationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  violationDot: {
    width: 6,
    height: 6,
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  violationText: {
    color: '#FF6B6B',
    fontSize: 10,
  },
});

/**
 * Level 0: TransactionPreview (matches src/components/ReportActionItem/TransactionPreview/index.tsx)
 * Entry point wrapper
 */
function TransactionPreview({ transaction }: { transaction: TransactionData }) {
  return (
    <View style={transactionPreviewWrapperStyles.container}>
      <TransactionPreviewContent transaction={transaction} />
    </View>
  );
}

const transactionPreviewWrapperStyles = StyleSheet.create({
  container: {
    marginRight: 8,
  },
});

// ============================================================
// Carousel and Message components
// ============================================================

function receiptKeyExtractor(item: TransactionData) {
  return item.transactionID;
}

/**
 * Horizontal carousel of receipts (like Expensify's MoneyRequestReportPreviewContent)
 * Uses FlatList horizontal (not FlashList) to match Expensify
 */
function ReceiptCarousel({ transactions }: { transactions: TransactionData[] }) {
  const renderReceiptItem = ({ item }: ListRenderItemInfo<TransactionData>) => (
    <TransactionPreview transaction={item} />
  );

  return (
    <FlatList
      horizontal
      data={transactions}
      renderItem={renderReceiptItem}
      keyExtractor={receiptKeyExtractor}
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={RECEIPT_WIDTH + 8}
      contentContainerStyle={styles.carouselContent}
      nestedScrollEnabled
      bounces={false}
    />
  );
}

/**
 * MoneyRequestReportPreviewContent wrapper
 */
function MoneyRequestReportPreviewContent({
  transactions,
  totalAmount,
  reportName,
}: {
  transactions: TransactionData[];
  totalAmount: number;
  reportName: string;
}) {
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalAmount / 100);

  return (
    <View style={styles.reportPreviewContent}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportName}>{reportName}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Draft</Text>
        </View>
        <Text style={styles.expenseCount}>{transactions.length} expenses</Text>
      </View>

      {/* Horizontal receipt carousel - NESTED FLATLIST */}
      <ReceiptCarousel transactions={transactions} />

      <View style={styles.reportFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{formattedTotal}</Text>
      </View>

      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * MoneyRequestReportPreview wrapper
 */
function MoneyRequestReportPreview({
  transactions,
  totalAmount,
  reportName,
}: {
  transactions: TransactionData[];
  totalAmount: number;
  reportName: string;
}) {
  return (
    <View style={styles.reportPreview}>
      <MoneyRequestReportPreviewContent
        transactions={transactions}
        totalAmount={totalAmount}
        reportName={reportName}
      />
    </View>
  );
}

/**
 * Message item (like Expensify's PureReportActionItem)
 */
function MessageItem({ item }: { item: MessageData }) {
  return (
    <View style={styles.messageContainer}>
      {/* Message header */}
      <View style={styles.messageHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>

      {/* Report preview card */}
      <View style={styles.reportCardWrapper}>
        <MoneyRequestReportPreview
          transactions={item.transactions}
          totalAmount={item.totalAmount}
          reportName={item.reportName}
        />
      </View>
    </View>
  );
}

function renderMessageItem({ item }: ListRenderItemInfo<MessageData>) {
  return <MessageItem item={item} />;
}

function messageKeyExtractor(item: MessageData) {
  return item.id;
}

/**
 * Main screen - Vertical FlatList (inverted) of messages
 * Matches Expensify's InvertedFlatList structure
 */
export default function EReceiptNestedListScreen() {
  const [messageCount, setMessageCount] = useState<MessageCountOption>(25);
  const [receiptsPerMessage, setReceiptsPerMessage] =
    useState<ReceiptsPerMessageOption>(5);
  const [renderImages, setRenderImages] = useState(true);

  const messages = useMemo(
    () => generateMockMessages(messageCount, receiptsPerMessage),
    [messageCount, receiptsPerMessage]
  );

  const totalReceipts = messageCount * receiptsPerMessage;

  return (
    <RenderImagesContext.Provider value={renderImages}>
      <View style={styles.root}>
        {/* Configuration panel */}
        <View style={styles.configPanel}>
          {/* Image toggle */}
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>expo-image:</Text>
            <View style={styles.switchRow}>
              <Switch
                value={renderImages}
                onValueChange={setRenderImages}
                trackColor={{ false: '#3A3A3A', true: '#03D47C' }}
                thumbColor="#FFFFFF"
              />
              <Text style={styles.switchLabel}>
                {renderImages ? 'ON' : 'OFF'}
              </Text>
            </View>
          </View>

          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Messages:</Text>
            <View style={styles.buttonRow}>
              {MESSAGE_COUNT_OPTIONS.map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.optionButton,
                    messageCount === count && styles.optionButtonActive,
                  ]}
                  onPress={() => setMessageCount(count)}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      messageCount === count && styles.optionButtonTextActive,
                    ]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Receipts/msg:</Text>
            <View style={styles.buttonRow}>
              {RECEIPTS_PER_MESSAGE_OPTIONS.map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.optionButton,
                    receiptsPerMessage === count && styles.optionButtonActive,
                  ]}
                  onPress={() => setReceiptsPerMessage(count)}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      receiptsPerMessage === count && styles.optionButtonTextActive,
                    ]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.totalInfo}>
            Total: {totalReceipts} eReceipts ({renderImages ? `${totalReceipts * 4} expo-image` : 'no images'})
          </Text>
        </View>

        {/* Vertical message list (like Expensify's InvertedFlatList) */}
        <FlatList
          inverted
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={messageKeyExtractor}
          contentContainerStyle={styles.listContent}
          // Match Expensify's InvertedFlatList settings
          removeClippedSubviews
          windowSize={15}
          maxToRenderPerBatch={5}
          initialNumToRender={10}
        />
      </View>
    </RenderImagesContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  configPanel: {
    padding: 12,
    backgroundColor: '#2A2A2A',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  configLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    width: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#3A3A3A',
  },
  optionButtonActive: {
    backgroundColor: '#03D47C',
  },
  optionButtonText: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '600',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  totalInfo: {
    color: '#888888',
    fontSize: 11,
    marginTop: 4,
  },
  listContent: {
    padding: 8,
  },

  // Message styles
  messageContainer: {
    marginBottom: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4DCFC6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    color: '#888888',
    fontSize: 11,
  },

  // Report card styles
  reportCardWrapper: {
    marginLeft: 52,
  },
  reportPreview: {
    backgroundColor: '#0A2E2A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  reportPreviewContent: {
    overflow: 'hidden',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  reportName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#3A3A3A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: '#AAAAAA',
    fontSize: 10,
  },
  expenseCount: {
    color: '#888888',
    fontSize: 12,
  },

  // Carousel styles
  carouselContent: {
    paddingHorizontal: 12,
  },

  // Footer styles
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1A3A36',
  },
  totalLabel: {
    color: '#888888',
    fontSize: 12,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#0A4A44',
    padding: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

EReceiptNestedListScreen.navigationOptions = {
  title: 'eReceipt Nested List (Chat)',
};
