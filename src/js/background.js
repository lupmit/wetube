const ON_COLOR = '#8fce00';
const OFF_COLOR = '#f44336';

chrome.storage.local.set({ skipAds: true });
chrome.action.setBadgeText({ text: 'on' });
chrome.action.setBadgeBackgroundColor({ color: ON_COLOR });

const handleActionClick = () => {
	chrome.storage.local.get(['skipAds'], ({ skipAds }) => {
		const newStatus = !skipAds;
		chrome.action.setBadgeText({ text: newStatus ? 'on' : 'off' });
		chrome.action.setBadgeBackgroundColor({ color: newStatus ? ON_COLOR : OFF_COLOR });
		chrome.storage.local.set({ skipAds: newStatus });
	});
};

chrome.action.onClicked.addListener(handleActionClick);

chrome.runtime.onStartup.addListener(() => {
	chrome.storage.local.get(['skipAds'], ({ skipAds }) => {
		chrome.action.setBadgeText({ text: skipAds ? 'on' : 'off' });
		chrome.action.setBadgeBackgroundColor({ color: skipAds ? ON_COLOR : OFF_COLOR });
	});
});
