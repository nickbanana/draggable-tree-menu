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
          { id: 10, name: 'Sales Report', path: '/dashboard/analytics/sales' },
          { id: 11, name: 'User Statistics', path: '/dashboard/analytics/users' }
        ]
      },
      {
        id: 5,
        name: 'Overview',
        path: '/dashboard/overview',
        menus: [
          { id: 12, name: 'Summary', path: '/dashboard/overview/summary' }
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
          { id: 13, name: 'Electronics', path: '/products/categories/electronics' },
          { id: 14, name: 'Clothing', path: '/products/categories/clothing' },
          { id: 15, name: 'Books', path: '/products/categories/books' }
        ]
      },
      {
        id: 7,
        name: 'Inventory',
        path: '/products/inventory',
        menus: [
          { id: 16, name: 'Stock Level', path: '/products/inventory/stock' },
          { id: 17, name: 'Suppliers', path: '/products/inventory/suppliers' }
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
          { id: 18, name: 'User List', path: '/settings/users/list' },
          { id: 19, name: 'Roles & Permissions', path: '/settings/users/roles' }
        ]
      },
      {
        id: 9,
        name: 'System',
        path: '/settings/system',
        menus: [
          { id: 20, name: 'General', path: '/settings/system/general' },
          { id: 21, name: 'Security', path: '/settings/system/security' },
          { id: 22, name: 'Backup', path: '/settings/system/backup' }
        ]
      }
    ]
  },
  {
    id: 23,
    name: 'Customers',
    path: '/customers',
    menus: [
      {
        id: 24,
        name: 'Directory',
        path: '/customers/directory',
        menus: [
          { id: 25, name: 'Active', path: '/customers/directory/active' },
          { id: 26, name: 'Archived', path: '/customers/directory/archived' }
        ]
      },
      {
        id: 27,
        name: 'Feedback',
        path: '/customers/feedback',
        menus: [
          { id: 28, name: 'Reviews', path: '/customers/feedback/reviews' },
          { id: 29, name: 'Surveys', path: '/customers/feedback/surveys' }
        ]
      }
    ]
  },
  {
    id: 30,
    name: 'Orders',
    path: '/orders',
    menus: [
      {
        id: 31,
        name: 'Management',
        path: '/orders/management',
        menus: [
          { id: 32, name: 'Pending', path: '/orders/management/pending' },
          { id: 33, name: 'Completed', path: '/orders/management/completed' },
          { id: 34, name: 'Cancelled', path: '/orders/management/cancelled' }
        ]
      },
      {
        id: 35,
        name: 'Shipping',
        path: '/orders/shipping',
        menus: [
          { id: 36, name: 'Track', path: '/orders/shipping/track' },
          { id: 37, name: 'Providers', path: '/orders/shipping/providers' }
        ]
      }
    ]
  },
  {
    id: 38,
    name: 'Marketing',
    path: '/marketing',
    menus: [
      {
        id: 39,
        name: 'Campaigns',
        path: '/marketing/campaigns',
        menus: [
          { id: 40, name: 'Email', path: '/marketing/campaigns/email' },
          { id: 41, name: 'Social Media', path: '/marketing/campaigns/social' }
        ]
      },
      {
        id: 42,
        name: 'SEO',
        path: '/marketing/seo',
        menus: [
          { id: 43, name: 'Keywords', path: '/marketing/seo/keywords' },
          { id: 44, name: 'Analytics', path: '/marketing/seo/analytics' }
        ]
      }
    ]
  },
  {
    id: 45,
    name: 'Content',
    path: '/content',
    menus: [
      {
        id: 46,
        name: 'Blog',
        path: '/content/blog',
        menus: [
          { id: 47, name: 'Posts', path: '/content/blog/posts' },
          { id: 48, name: 'Comments', path: '/content/blog/comments' }
        ]
      },
      {
        id: 49,
        name: 'Media',
        path: '/content/media',
        menus: [
          { id: 50, name: 'Images', path: '/content/media/images' },
          { id: 51, name: 'Videos', path: '/content/media/videos' }
        ]
      }
    ]
  },
  {
    id: 52,
    name: 'Support',
    path: '/support',
    menus: [
      {
        id: 53,
        name: 'Tickets',
        path: '/support/tickets',
        menus: [
          { id: 54, name: 'Open', path: '/support/tickets/open' },
          { id: 55, name: 'Closed', path: '/support/tickets/closed' }
        ]
      },
      {
        id: 56,
        name: 'FAQ',
        path: '/support/faq',
        menus: [
          { id: 57, name: 'Categories', path: '/support/faq/categories' },
          { id: 58, name: 'Articles', path: '/support/faq/articles' }
        ]
      }
    ]
  },
  {
    id: 59,
    name: 'Finances',
    path: '/finances',
    menus: [
      {
        id: 60,
        name: 'Billing',
        path: '/finances/billing',
        menus: [
          { id: 61, name: 'Invoices', path: '/finances/billing/invoices' },
          { id: 62, name: 'Receipts', path: '/finances/billing/receipts' }
        ]
      },
      {
        id: 63,
        name: 'Taxes',
        path: '/finances/taxes',
        menus: [
          { id: 64, name: 'Reports', path: '/finances/taxes/reports' },
          { id: 65, name: 'Settings', path: '/finances/taxes/settings' }
        ]
      }
    ]
  },
  {
    id: 66,
    name: 'Integrations',
    path: '/integrations',
    menus: [
      {
        id: 67,
        name: 'API',
        path: '/integrations/api',
        menus: [
          { id: 68, name: 'Keys', path: '/integrations/api/keys' },
          { id: 69, name: 'Logs', path: '/integrations/api/logs' }
        ]
      },
      {
        id: 70,
        name: 'Webhooks',
        path: '/integrations/webhooks',
        menus: [
          { id: 71, name: 'Endpoints', path: '/integrations/webhooks/endpoints' },
          { id: 72, name: 'Events', path: '/integrations/webhooks/events' }
        ]
      }
    ]
  },
  // 以下為程式化動態生成的 Lorem Ipsum 項目 (共 40 個第一層)，以符合 50 個上限與 3 層深度
  ...Array.from({ length: 40 }).map((_, index) => {
    const rootIndex = index + 11;
    // 從前面累積的 ID (72) 繼續往下推算，每個 root 佔用 7 個 ID
    const baseId = 73 + (index * 7);
    return {
      id: baseId,
      name: `Lorem Ipsum ${rootIndex}`,
      path: `/lorem-${rootIndex}`,
      menus: [
        {
          id: baseId + 1,
          name: `Dolor ${rootIndex}-1`,
          path: `/lorem-${rootIndex}/dolor-1`,
          menus: [
            { id: baseId + 2, name: `Sit Amet ${rootIndex}-1-1`, path: `/lorem-${rootIndex}/dolor-1/sit-1` },
            { id: baseId + 3, name: `Sit Amet ${rootIndex}-1-2`, path: `/lorem-${rootIndex}/dolor-1/sit-2` }
          ]
        },
        {
          id: baseId + 4,
          name: `Dolor ${rootIndex}-2`,
          path: `/lorem-${rootIndex}/dolor-2`,
          menus: [
            { id: baseId + 5, name: `Sit Amet ${rootIndex}-2-1`, path: `/lorem-${rootIndex}/dolor-2/sit-1` },
            { id: baseId + 6, name: `Sit Amet ${rootIndex}-2-2`, path: `/lorem-${rootIndex}/dolor-2/sit-2` }
          ]
        }
      ]
    };
  })
];
