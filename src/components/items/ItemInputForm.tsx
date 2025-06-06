import {
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem
} from '@gluestack-ui/themed';
import { InputAccessoryView, View, Platform } from 'react-native';
import { KeyboardCloseButton } from './KeyboardCloseButton';
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';

type ItemInputFormProps = {
  title: string;
  content: string;
  onChangeTitle: (text: string) => void;
  onChangeContent: (text: string) => void;
};

const inputAccessoryViewID1 = 'INPUT_ACCESSORY_VIEW_ID_1';
const inputAccessoryViewID2 = 'INPUT_ACCESSORY_VIEW_ID_2';

/**
 * アイテムの入力フォーム
 * @param props プロパティ
 * @returns アイテム入力フォーム
 */
const ItemInputForm: React.FC<ItemInputFormProps> = props => {
  const { title, content, onChangeTitle, onChangeContent } = props;

  return (
    <View style={{ flex: 1, paddingBottom: 100 }}>
      {/* タイトル入力 */}
      <Input borderWidth={0} minWidth={'$full'} marginTop={'$4'} marginBottom={'$1'}>
        <InputField
          placeholder="タイトルを入力してください"
          value={title}
          onChangeText={onChangeTitle}
          inputAccessoryViewID={inputAccessoryViewID1}
          fontSize={'$2xl'}
          fontWeight={'$bold'}
          editable={true}
        />
      </Input>

      {/* グループ選択 */}
      <Select>
        <SelectTrigger variant="outline" size="md" style={{ zIndex: 1000 }}>
          <SelectInput placeholder="グループを選択" />
          <SelectIcon>
            <Entypo name="chevron-down" size={20} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent style={{ zIndex: 2000 }}>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="仕事" value="work" />
            <SelectItem label="プライベート" value="private" />
            <SelectItem label="その他" value="other" />
          </SelectContent>
        </SelectPortal>
      </Select>

      {/* 内容入力 */}
      <Textarea borderWidth={0} minWidth={'$full'} minHeight={'$full'} marginTop={'$16'}>
        <TextareaInput
          placeholder="内容を入力してください"
          value={content}
          scrollEnabled={true}
          onChangeText={onChangeContent}
          inputAccessoryViewID={inputAccessoryViewID2}
          paddingHorizontal={'$5'}
          fontSize={'$md'}
        />
      </Textarea>

      {/* iOSのみキーボードの閉じるボタンを表示 */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID1} backgroundColor={'#F1F1F1'}>
          <KeyboardCloseButton />
        </InputAccessoryView>
      )}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID2} backgroundColor={'#F1F1F1'}>
          <KeyboardCloseButton />
        </InputAccessoryView>
      )}
    </View>
  );
};

export { ItemInputForm };
