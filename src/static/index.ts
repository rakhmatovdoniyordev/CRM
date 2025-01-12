import MailIcon from '@mui/icons-material/Mail';
import React from 'react';
import InboxIcon from '@mui/icons-material/Inbox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default interface Ilink {
  title: string;
  url: string;
  icon: React.ReactNode;
}

export const LINKS: Ilink[] = [
    {
      title: 'Customer',
      url: '/',
      icon: React.createElement(InboxIcon)
    },
    {
      title: 'Seller',
      url: '/seller',
      icon: React.createElement(MailIcon)
    },
    {
      title: 'Product',
      url: '/product',
      icon: React.createElement(ShoppingCartIcon)
    }
  ]