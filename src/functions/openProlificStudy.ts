import { browser } from 'webextension-scripts/polyfill';

export function openProlificStudy(id: string) {
  browser.tabs.create({ url: `https://app.prolific.co/studies/${id}` });
}
