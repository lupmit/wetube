const ON_COLOR = '#8fce00';
const OFF_COLOR = '#f44336';

chrome.storage.local.set({ skip: true });
chrome.action.setBadgeText({ text: 'on' });
chrome.action.setBadgeBackgroundColor({ color: ON_COLOR });

const handleActionClick = () => {
	chrome.storage.local.get(['skip'], ({ skip }) => {
		const newStatus = !skip;
		chrome.action.setBadgeText({ text: newStatus ? 'on' : 'off' });
		chrome.action.setBadgeBackgroundColor({ color: newStatus ? ON_COLOR : OFF_COLOR });
		chrome.storage.local.set({ skip: newStatus });
	});
};

chrome.action.onClicked.addListener(handleActionClick);

chrome.runtime.onStartup.addListener(() => {
	chrome.storage.local.get(['skip'], ({ skip }) => {
		chrome.action.setBadgeText({ text: skip ? 'on' : 'off' });
		chrome.action.setBadgeBackgroundColor({ color: skip ? ON_COLOR : OFF_COLOR });
	});
});
