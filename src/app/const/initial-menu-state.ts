import { MenuItem } from "../entity/menu-item";

export const INITIAL_MENU_STATE: MenuItem[] = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    menus: [
      {
        id: 4,
        name: 'Analytics',
        path: '/dashboard/analytics',
        menus: [
          {
            id: 10,
            name: 'Sales Report',
            path: '/dashboard/analytics/sales'
          },
          {
            id: 11,
            name: 'User Statistics',
            path: '/dashboard/analytics/users'
          }
        ]
      },
      {
        id: 5,
        name: 'Overview',
        path: '/dashboard/overview',
        menus: [
          {
            id: 12,
            name: 'Summary',
            path: '/dashboard/overview/summary'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Products',
    path: '/products',
    menus: [
      {
        id: 6,
        name: 'Categories',
        path: '/products/categories',
        menus: [
          {
            id: 13,
            name: 'Electronics',
            path: '/products/categories/electronics'
          },
          {
            id: 14,
            name: 'Clothing',
            path: '/products/categories/clothing'
          },
          {
            id: 15,
            name: 'Books',
            path: '/products/categories/books'
          }
        ]
      },
      {
        id: 7,
        name: 'Inventory',
        path: '/products/inventory',
        menus: [
          {
            id: 16,
            name: 'Stock Level',
            path: '/products/inventory/stock'
          },
          {
            id: 17,
            name: 'Suppliers',
            path: '/products/inventory/suppliers'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Settings',
    path: '/settings',
    menus: [
      {
        id: 8,
        name: 'User Management',
        path: '/settings/users',
        menus: [
          {
            id: 18,
            name: 'User List',
            path: '/settings/users/list'
          },
          {
            id: 19,
            name: 'Roles & Permissions',
            path: '/settings/users/roles'
          }
        ]
      },
      {
        id: 9,
        name: 'System',
        path: '/settings/system',
        menus: [
          {
            id: 20,
            name: 'General',
            path: '/settings/system/general'
          },
          {
            id: 21,
            name: 'Security',
            path: '/settings/system/security'
          },
          {
            id: 22,
            name: 'Backup',
            path: '/settings/system/backup'
          }
        ]
      }
    ]
  }
];
