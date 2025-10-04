
import { I18nProvider, useI18n } from './index.tsx';

// Explicitly re-exporting instead of using a wildcard export.
// This can help some module bundlers correctly resolve and transpile the .tsx file.
export { I18nProvider, useI18n };
