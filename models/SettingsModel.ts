
export interface AppSettings {
  selectedDeviceId: string;
  isAmbientMode: boolean;
  isAudioOutputEnabled: boolean;
  isSystemAudioEnabled: boolean;
  activeMode: 'AUTO' | 'EN_INPUT' | 'TR_INPUT';
}

export const defaultSettings: AppSettings = {
  selectedDeviceId: '',
  isAmbientMode: false,
  isAudioOutputEnabled: true,
  isSystemAudioEnabled: false,
  activeMode: 'AUTO',
};
