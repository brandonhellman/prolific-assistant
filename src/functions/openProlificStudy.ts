import { browser } from 'webextension-polyfill-ts';

export function openProlificStudy(id: string) {
  browser.tabs.create({ url: `https://app.prolific.co/studies/${id}` });
}
