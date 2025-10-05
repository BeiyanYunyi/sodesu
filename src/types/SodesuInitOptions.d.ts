import type { WalineInitOptions, WalineProps } from '../waline/typings';
import type { WalineConfig } from '../waline/utils/config';

export default interface SodesuInitOptions
  extends Omit<
    WalineInitOptions,
    'emoji' | 'search' | 'highlighter' | 'imageUploader' | 'texRenderer'
  > {
  commentClassName?: string;
  renderPreview?: (text: string) => Promise<string>;
}

export interface SodesuConfig extends WalineConfig {
  commentClassName?: string;
  renderPreview: (text: string) => Promise<string>;
}

export interface SodesuProps
  extends Omit<WalineProps, 'emoji' | 'search' | 'highlighter' | 'imageUploader' | 'texRenderer'> {
  commentClassName?: string;
  renderPreview?: (text: string) => Promise<string>;
}
