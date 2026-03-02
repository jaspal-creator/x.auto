import * as React from 'react';
import { List as VList, ListProps } from 'react-virtualized';

export const VirtualizedList: React.FC<ListProps> = (props) => {
  return <VList {...props} />;
};
