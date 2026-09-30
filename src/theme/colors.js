import {DynamicColorIOS, Platform, PlatformColor} from 'react-native';

const adaptive = (name, light, dark) => Platform.select({
  ios: DynamicColorIOS({light, dark}),
  android: PlatformColor(`@color/${name}`),
  default: light,
});

export const colors = {
  background: adaptive('app_background', '#f4f4f4', '#111827'),
  surface: adaptive('app_surface', '#ffffff', '#1f2937'),
  surfaceMuted: adaptive('app_surface_muted', '#f1f5f9', '#334155'),
  text: adaptive('app_text', '#111827', '#f8fafc'),
  textMuted: adaptive('app_text_muted', '#64748b', '#cbd5e1'),
  border: adaptive('app_border', '#e2e8f0', '#475569'),
};
