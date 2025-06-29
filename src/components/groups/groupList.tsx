import { ListItem } from '@rneui/base';

type GroupListProps = {
  name: string;
  color: string;
};

const GroupList: React.FC<GroupListProps> = props => {
  const { name, color } = props;
  return (
    <ListItem.Swipeable bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
      </ListItem.Content>
    </ListItem.Swipeable>
  );
};

export default GroupList;
