import type { GetCommentResponse } from '@waline/api';
import type { WalineInitOptions, WalineProps } from '../vendor/waline/typings';
import type { WalineConfig } from '../vendor/waline/utils/config';

/** The first page returned by getComment, matching path, lang, pageSize and sorting. */
export type SodesuInitialData = Pick<GetCommentResponse, 'data' | 'count' | 'totalPages'>;

export default interface SodesuInitOptions extends Omit<
  WalineInitOptions,
  'emoji' | 'search' | 'highlighter' | 'imageUploader' | 'texRenderer'
> {
  /** Initial first-page snapshot; rendered immediately and revalidated after mount. */
  initialData?: SodesuInitialData;
  copyright?: boolean;
  commentClassName?: string;
  renderPreview?: (text: string) => Promise<string>;
}

export interface SodesuConfig extends WalineConfig {
  /** Initial first-page snapshot; rendered immediately and revalidated after mount. */
  initialData?: SodesuInitialData;
  copyright?: boolean;
  commentClassName?: string;
  renderPreview: (text: string) => Promise<string>;
}

export interface SodesuProps extends Omit<
  WalineProps,
  'emoji' | 'search' | 'highlighter' | 'imageUploader' | 'texRenderer'
> {
  /** Initial first-page snapshot; rendered immediately and revalidated after mount. */
  initialData?: SodesuInitialData;
  copyright?: boolean;
  commentClassName?: string;
  renderPreview?: (text: string) => Promise<string>;
}
