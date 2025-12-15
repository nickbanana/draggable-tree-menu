export interface MenuItem {
  /** 選單ID */
  id: number;
  /** 子選單 */
  menus?: MenuItem[];
  /** 選單名稱 */
  name: string;
  /** 選單路徑 */
  path: string;
  disabled?: boolean;
  expanded?: boolean;
}
