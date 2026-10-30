import Sodesu, { init, type SodesuInitialData, type SodesuInitOptions } from 'sodesu-comment';
import { init as standalone } from 'sodesu-comment/aio';
import Component from 'sodesu-comment/component';
import preset from 'sodesu-comment/preset';
import safelist from 'sodesu-comment/safeList';
import type { ComponentProps } from 'svelte';

const initialData: SodesuInitialData = { data: [], count: 0, totalPages: 0 };
const options: SodesuInitOptions = {
  serverURL: 'https://comments.example',
  copyright: false,
  initialData,
};
const props: ComponentProps<typeof Component> = options;
void [Sodesu.init, init, standalone, preset(), safelist, props];
