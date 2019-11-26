import { Avatar, Dropdown, Menu, Spin } from 'antd';
import { User } from 'firebase/app';
import React from 'react';

interface Props {
  initializing: boolean;
  haveUser: boolean;
  user: User | null;
}

function menu(haveUser: boolean) {
  if (haveUser) {
    return (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a rel="noopener noreferrer" href="/signin">
            Sign Out
          </a>
        </Menu.Item>
      </Menu>
    );
  }
  return (
    <Menu>
      <Menu.Item>
        <a rel="noopener noreferrer" href="/signin">
          Sign In
        </a>
      </Menu.Item>
    </Menu>
  );
}

export const RightContents: React.FC<Props> = ({ initializing, haveUser, user }) => {
  if (initializing) {
    return <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />;
  }
  const overlayMenu = menu(haveUser);
  if (initializing === false && haveUser === true && !!user) {
    return (
      <Dropdown overlay={overlayMenu}>
        <Avatar size="small" alt="avatar" src={user.photoURL || undefined} />
      </Dropdown>
    );
  }
  return (
    <Dropdown overlay={overlayMenu}>
      <Avatar size="small" alt="avatar" icon="user" />;
    </Dropdown>
  );
};
