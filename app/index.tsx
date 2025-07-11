import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import * as ItemService from '../src/services/itemService';
import * as Crypto from 'expo-crypto';
import * as GroupService from '../src/services/groupService';

import initialItemData from '../src/data/initialItemData.json';
import initialGroupData from '../src/data/initialGroupData.json';
export default function InitialScreen() {
  useEffect(() => {
    initApp();
  }, []);

  /**
   * アプリ起動時処理
   */
  const initApp = async () => {
    try {
      await ItemService.createTable();
      await GroupService.createTable();

      await initDatabase();

      // 初期化が完了したら、ホーム画面に遷移
      router.replace('/home');
    } catch (e) {
      console.log('初期化エラー', e);
    }
  };

  /**
   * データベース初期化処理
   */
  const initDatabase = async () => {
    // Itemのレコードが0件なら初期データをINSERT
    const itemNum = await ItemService.countItems();
    if (itemNum === 0) {
      console.log('Item Count が0件なので初期アイテムデータをINSERTします');
      for (const key in initialItemData) {
        const id = Crypto.randomUUID();
        await ItemService.createItem(
          id,
          initialItemData[key].title,
          initialItemData[key].content,
          initialItemData[key].group_id
        );
      }
    }

    // Groupのレコードが0件なら初期データをINSERT
    const groupNum = await GroupService.countGroups();
    if (groupNum === 0) {
      console.log('Group Count が0件なので初期グループデータをINSERTします');
      for (const key in initialGroupData) {
        await GroupService.insertGroup(
          initialGroupData[key].id,
          initialGroupData[key].name,
          initialGroupData[key].color,
          initialGroupData[key].position
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アプリ起動中...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEF4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
