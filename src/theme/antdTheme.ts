import type { ThemeConfig } from '../libs/antd';
import { palette } from './tokens';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: palette.primary,
    colorError: palette.accent,
    colorSuccess: palette.positive,
    colorTextBase: palette.dark,
    colorBgBase: palette.background,
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Layout: { siderBg: palette.dark },
    Table: { headerBg: palette.primarySoft },
  },
};
