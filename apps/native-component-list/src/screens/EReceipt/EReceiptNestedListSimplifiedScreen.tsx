import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { Image } from 'expo-image';
import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const MESSAGE_COUNT_OPTIONS = [10, 25, 50, 100] as const;
const RECEIPTS_PER_MESSAGE_OPTIONS = [3, 5, 9, 10] as const;

type MessageCountOption = (typeof MESSAGE_COUNT_OPTIONS)[number];
type ReceiptsPerMessageOption = (typeof RECEIPTS_PER_MESSAGE_OPTIONS)[number];

type ReceiptData = { id: string };
type MessageData = { id: string; receipts: ReceiptData[] };

const UseFlashListNestedContext = createContext(false);

function generateMessages(messageCount: number, receiptsPerMessage: number): MessageData[] {
  return Array.from({ length: messageCount }, (_, i) => ({
    id: `msg_${i}`,
    receipts: Array.from({ length: receiptsPerMessage }, (_, j) => ({
      id: `msg_${i}_receipt_${j}`,
    })),
  }));
}

const eReceiptBG = require('../../../assets/eReceipt/eReceiptBGs/eReceiptBG_yellow.svg');

function ReceiptItem() {
  return (
    <View style={styles.receiptItem}>
      <Image source={eReceiptBG} style={styles.receiptImage} contentFit="cover" />
    </View>
  );
}

function renderReceiptItem({ item }: ListRenderItemInfo<ReceiptData>) {
  return <ReceiptItem />;
}

function receiptKeyExtractor(item: ReceiptData) {
  return item.id;
}

function ReceiptCarousel({ receipts }: { receipts: ReceiptData[] }) {
  const useFlashListNested = useContext(UseFlashListNestedContext);

  if (useFlashListNested) {
    return (
      <FlashList
        horizontal
        data={receipts}
        renderItem={renderReceiptItem}
        keyExtractor={receiptKeyExtractor}
        estimatedItemSize={140}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  return (
    <FlatList
      horizontal
      data={receipts}
      renderItem={renderReceiptItem}
      keyExtractor={receiptKeyExtractor}
      showsHorizontalScrollIndicator={false}
    />
  );
}

function MessageItem({ item }: { item: MessageData }) {
  return (
    <View style={styles.messageItem}>
      <Text style={styles.messageTitle}>Message {item.id}</Text>
      <ReceiptCarousel receipts={item.receipts} />
    </View>
  );
}

function renderMessageItem({ item }: ListRenderItemInfo<MessageData>) {
  return <MessageItem item={item} />;
}

function messageKeyExtractor(item: MessageData) {
  return item.id;
}

export default function EReceiptNestedListSimplifiedScreen() {
  const [messageCount, setMessageCount] = useState<MessageCountOption>(25);
  const [receiptsPerMessage, setReceiptsPerMessage] = useState<ReceiptsPerMessageOption>(5);
  const [useFlashListMain, setUseFlashListMain] = useState(false);
  const [useFlashListNested, setUseFlashListNested] = useState(false);

  const messages = useMemo(
    () => generateMessages(messageCount, receiptsPerMessage),
    [messageCount, receiptsPerMessage]
  );

  const totalReceipts = messageCount * receiptsPerMessage;

  return (
    <View style={styles.root}>
      <View style={styles.config}>
        <View style={styles.row}>
          <Text style={styles.label}>Main list:</Text>
          <Text style={styles.switchLabel}>FlatList</Text>
          <Switch
            value={useFlashListMain}
            onValueChange={setUseFlashListMain}
            trackColor={{ false: '#3A3A3A', true: '#03D47C' }}
            thumbColor="#FFFFFF"
          />
          <Text style={styles.switchLabel}>FlashList</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nested lists:</Text>
          <Text style={styles.switchLabel}>FlatList</Text>
          <Switch
            value={useFlashListNested}
            onValueChange={setUseFlashListNested}
            trackColor={{ false: '#3A3A3A', true: '#03D47C' }}
            thumbColor="#FFFFFF"
          />
          <Text style={styles.switchLabel}>FlashList</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Messages:</Text>
          {MESSAGE_COUNT_OPTIONS.map((count) => (
            <TouchableOpacity
              key={count}
              style={[styles.btn, messageCount === count && styles.btnActive]}
              onPress={() => setMessageCount(count)}>
              <Text style={[styles.btnText, messageCount === count && styles.btnTextActive]}>
                {count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Receipts/msg:</Text>
          {RECEIPTS_PER_MESSAGE_OPTIONS.map((count) => (
            <TouchableOpacity
              key={count}
              style={[styles.btn, receiptsPerMessage === count && styles.btnActive]}
              onPress={() => setReceiptsPerMessage(count)}>
              <Text style={[styles.btnText, receiptsPerMessage === count && styles.btnTextActive]}>
                {count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.info}>Total: {totalReceipts} images</Text>
      </View>

      <UseFlashListNestedContext.Provider value={useFlashListNested}>
        {useFlashListMain ? (
          <FlashList
            inverted
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={messageKeyExtractor}
            estimatedItemSize={200}
          />
        ) : (
          <FlatList
            inverted
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={messageKeyExtractor}
          />
        )}
      </UseFlashListNestedContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  config: {
    padding: 12,
    backgroundColor: '#2A2A2A',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    width: 80,
  },
  switchLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#3A3A3A',
  },
  btnActive: {
    backgroundColor: '#03D47C',
  },
  btnText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  btnTextActive: {
    color: '#FFFFFF',
  },
  info: {
    color: '#888888',
    fontSize: 11,
  },
  messageItem: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  messageTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  receiptItem: {
    width: 130,
    height: 180,
    marginRight: 8,
  },
  receiptImage: {
    flex: 1,
    borderRadius: 8,
  },
});

EReceiptNestedListSimplifiedScreen.navigationOptions = {
  title: 'eReceipt Nested (Simplified)',
};
