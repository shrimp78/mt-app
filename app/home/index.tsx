import { router, useFocusEffect, Stack } from 'expo-router';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  SectionList,
  LayoutAnimation,
  TouchableOpacity,
  GestureResponderEvent,
  Dimensions
} from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import * as ItemService from '../../src/services/itemService';
import * as GroupService from '../../src/services/groupService';
import { type Item } from '../../src/components/types/item';
import { type Group } from '../../src/components/types/group';
import ItemList from '../../src/components/screens/home/ItemList';
import { useGroups } from '../../src/context/GroupContext';

// 新規作成モーダル用
import * as Crypto from 'expo-crypto';
import ItemCreateModal from '../../src/components/screens/home/ItemCreateModal';
import HomeMenuModal from '../../src/components/screens/home/HomeMenuModal';
import FloatingFolderButton from '../../src/components/common/floatingFolderButton';
import FloatingPlusButton from '../../src/components/common/floatingPlusButton';

// グループ作成モーダル用
import GroupCreateModal from '../../src/components/screens/groups/groupCreateModal';

export default function HomeScreen() {
  const { groups, loadGroups } = useGroups();
  const [items, setItems] = useState<Item[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [groupColor, setGroupColor] = useState<string>('#2196f3');

  // 新規作成画面のModal用
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const toggleCreateModal = () => {
    if (createModalVisible) {
      // モーダルを閉じる際に状態をリセット
      setTitle('');
      setContent('');
      setSelectedGroup(null);
    } else {
      // モーダルを開く際、groupsが1個しかない場合は自動選択
      if (groups.length === 1) {
        setSelectedGroup(groups[0]);
      }
    }
    setCreateModalVisible(!createModalVisible);
  };

  // グループ作成モーダル用
  const [groupCreateModalVisible, setGroupCreateModalVisible] = useState(false);
  const toggleGroupCreateModal = () => {
    if (groupCreateModalVisible) {
      // モーダルを閉じる際に状態をリセット
      setGroupName('');
      setGroupColor('#2196f3');
    }
    setGroupCreateModalVisible(!groupCreateModalVisible);
  };

  // グループ選択画面のModal用
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const toggleGroupModal = () => {
    setGroupModalVisible(!groupModalVisible);
  };

  // ホームメニューModal用
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;

    // メニューボタンの位置を画面の右端に近い場合は左寄せに、左端に近い場合は右寄せに調整 TODO: この部分キモいから後で直す
    const margin = 20;
    const estimatedMenuWidth = 150; // より現実的な推定値

    let x = pageX - estimatedMenuWidth / 2; // 中央揃えを試みる

    // 画面内に収まるように調整
    if (x < margin) {
      x = margin;
    } else if (x + estimatedMenuWidth > screenWidth - margin) {
      x = screenWidth - estimatedMenuWidth - margin;
    }

    setMenuPosition({ x, y: pageY + 10 });
    toggleMenu();
  };

  const handleDeleteAllItemPress = () => {
    console.log('全てのアイテムを削除するが押されました');
    toggleMenu();
    Alert.alert('確認', '全てのアイテムを削除しますか？', [
      {
        text: 'キャンセル',
        style: 'cancel'
      },
      { text: '削除', onPress: () => deleteAllItem() }
    ]);
  };

  const deleteAllItem = async () => {
    await ItemService.deleteAllItems();
    await GroupService.deleteAllGroups();
    const items = await ItemService.getAllItems();
    setItems(items);
    await loadGroups();
  };

  const handleFolderIconPress = () => {
    console.log('フォルダーのアイコンが押されました');
    router.push({ pathname: `/groups` });
  };

  // リストのデータを都度更新するためのフック
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadGroups]) // loadGroupsが変更された時も再実行
  );

  // 初回データ読み込み
  const loadData = async () => {
    const items = await ItemService.getAllItems();
    setItems(items);
    await loadGroups();
  };

  // アイテムの新規作成
  const handleAddItemPress = () => {
    console.log('アイテムの新規作成が押されました');
    if (groups.length === 0) {
      Alert.alert('確認', '現在グループがありません。先にグループを作成してください');
      setGroupCreateModalVisible(true);
    } else {
      toggleCreateModal();
    }
  };

  // グループ選択処理
  const handleSelectGroup = () => {
    console.log('グループ選択が押されました');
    toggleGroupModal();
  };

  // アイテムの保存処理
  const handleSaveItemPress = async () => {
    console.log('アイテムの保存が押されました');

    // バリデーション
    if (!title) {
      Alert.alert('確認', 'タイトルを入力してください');
      return;
    }
    if (!content) {
      Alert.alert('確認', 'コンテンツを入力してください');
      return;
    }
    if (!selectedGroup) {
      Alert.alert('確認', 'グループを選択してください');
      return;
    }
    // 保存処理
    try {
      const id = Crypto.randomUUID();
      const group_id = selectedGroup?.id ?? null;
      await ItemService.createItem(id, title, content, group_id);
      toggleCreateModal();
      const items = await ItemService.getAllItems();
      setItems(items);
      await loadGroups();
    } catch (e) {
      Alert.alert('エラー', '保存に失敗しました');
      console.error(e);
    } finally {
      setTitle('');
      setContent('');
    }
  };

  // アイテムが押された時の処理
  const handleItemPress = (itemId: string) => {
    console.log('アイテムが押されました', itemId);
    router.push({ pathname: `/items/${itemId}` });
  };

  // アイテムの削除
  const handleDeletePress = async (itemId: string) => {
    console.log('アイテムの削除が押されました', itemId);
    try {
      await ItemService.deleteItemById(itemId);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const updatedItems = await ItemService.getAllItems();
      setItems(updatedItems);
    } catch (e) {
      Alert.alert('エラー', '削除に失敗しました');
      throw e;
    }
  };

  // グループの保存処理
  const handleSaveGroupPress = async () => {
    const id = Crypto.randomUUID();
    const position = 65536;
    console.log('グループの保存が押されました');
    try {
      await GroupService.insertGroup(id, groupName, groupColor, position);
      const items = await ItemService.getAllItems();
      setItems(items);
      await loadGroups();
      toggleGroupCreateModal();
      toggleCreateModal();
    } catch (e) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  };

  // グループセクション用のデータ整形
  const sections = groups
    .map(group => ({
      title: group.name,
      color: group.color,
      data: items.filter(item => item.group_id === group.id)
    }))
    .filter(section => section.data.length > 0); // アイテムが1つ以上あるセクションのみを表示

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleMenuPress} style={{ marginRight: 16 }}>
              <Entypo name="dots-three-horizontal" size={24} color="#808080" />
            </TouchableOpacity>
          )
        }}
      />
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={[styles.groupName, { color: section.color }]}>{section.title}</Text>
            <View style={[styles.sectionHeaderBorder, { backgroundColor: section.color }]} />
          </View>
        )}
        renderItem={({ item }) => (
          <ItemList
            name={item.title}
            content={item.content}
            onPress={() => handleItemPress(item.id)}
            onDeletePress={() => handleDeletePress(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items</Text>
          </View>
        }
        ListFooterComponent={<View style={styles.bottomContainer} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        stickySectionHeadersEnabled={false}
      />
      <FloatingFolderButton onPress={handleFolderIconPress} />
      <FloatingPlusButton onPress={handleAddItemPress} />

      <ItemCreateModal
        visible={createModalVisible}
        toggleCreateModal={toggleCreateModal}
        onSave={handleSaveItemPress}
        onChangeTitle={setTitle}
        onChangeContent={setContent}
        onSelectGroup={handleSelectGroup}
        title={title}
        content={content}
        groupModalVisible={groupModalVisible}
        toggleGroupModal={toggleGroupModal}
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />

      <HomeMenuModal
        visible={menuVisible}
        onClose={toggleMenu}
        menuPosition={menuPosition}
        onDeleteAllItemPress={handleDeleteAllItemPress}
      />

      <GroupCreateModal
        visible={groupCreateModalVisible}
        toggleCreateModal={toggleGroupCreateModal}
        onSave={handleSaveGroupPress}
        groupName={groupName}
        groupColor={groupColor}
        onChangeGroupName={setGroupName}
        onChangeGroupColor={setGroupColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4'
  },
  bottomContainer: {
    height: 100
  },
  sectionHeader: {},
  groupName: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 24,
    marginLeft: 14,
    fontWeight: 'bold'
  },
  sectionHeaderBorder: {
    flex: 1,
    height: 2
  },
  emptyContainer: {
    flex: 1,
    minHeight: Dimensions.get('window').height * 0.7, // 画面の高さのX%
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#808080'
  }
});
