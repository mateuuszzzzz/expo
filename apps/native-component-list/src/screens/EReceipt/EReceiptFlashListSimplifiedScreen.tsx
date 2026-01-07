import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const COLUMNS_COUNT = 2;
const ITEM_SIZE = (WINDOW_WIDTH - 24) / COLUMNS_COUNT;

const LIST_SIZE_OPTIONS = [250, 500, 750, 1000] as const;
type ListSize = (typeof LIST_SIZE_OPTIONS)[number];

type ItemData = {
  id: string;
};

function generateItems(count: number): ItemData[] {
  return Array.from({ length: count }, (_, i) => ({ id: `item_${i}` }));
}

const eReceiptBG = require('../../../assets/eReceipt/eReceiptBGs/eReceiptBG_yellow.svg');

function Item() {
  return (
    <View style={styles.item}>
      <Image source={eReceiptBG} style={styles.image} contentFit="cover" />
    </View>
  );
}

function renderItem({ item }: ListRenderItemInfo<ItemData>) {
  return <Item />;
}

function keyExtractor(item: ItemData) {
  return item.id;
}

export default function EReceiptFlashListSimplifiedScreen() {
  const [listSize, setListSize] = useState<ListSize>(250);
  const [useFlashList, setUseFlashList] = useState(true);

  const items = useMemo(() => generateItems(listSize), [listSize]);

  return (
    <View style={styles.root}>
      <View style={styles.config}>
        <View style={styles.row}>
          <Text style={styles.label}>List type:</Text>
          <Text style={styles.switchLabel}>FlatList</Text>
          <Switch
            value={useFlashList}
            onValueChange={setUseFlashList}
            trackColor={{ false: '#3A3A3A', true: '#03D47C' }}
            thumbColor="#FFFFFF"
          />
          <Text style={styles.switchLabel}>FlashList</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Items:</Text>
          {LIST_SIZE_OPTIONS.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.btn, listSize === size && styles.btnActive]}
              onPress={() => setListSize(size)}>
              <Text style={[styles.btnText, listSize === size && styles.btnTextActive]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {useFlashList ? (
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={COLUMNS_COUNT}
          estimatedItemSize={ITEM_SIZE}
        />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={COLUMNS_COUNT}
        />
      )}
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
    fontSize: 14,
    width: 70,
  },
  switchLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  item: {
    flex: 1,
    aspectRatio: 1,
    padding: 4,
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
});

EReceiptFlashListSimplifiedScreen.navigationOptions = {
  title: 'eReceipt FlashList (Simplified)',
};
