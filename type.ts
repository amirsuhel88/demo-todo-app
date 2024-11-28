import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  NewTodo: undefined;
};

export type HomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type NewTodoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewTodo'
>;
