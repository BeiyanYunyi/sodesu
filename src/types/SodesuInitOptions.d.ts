import type { WalineInitOptions, WalineProps } from '@waline/client';
import type { WalineConfig } from '../waline/utils/config';

export default interface SodesuInitOptions extends WalineInitOptions {
  commentClassName?: string;
  renderPreview?: (text: string) => Promise<string>;
}

export interface SodesuConfig extends WalineConfig {
  commentClassName?: string;
  renderPreview: (text: string) => Promise<string>;
}

export interface SodesuProps extends WalineProps {
  commentClassName?: string;
  renderPreview?: (text: string) => Promise<string>;
}
