// Init settings
let counter = 0;
let isSkipAds = true;

chrome.storage.local.get(['isSkipAds'], ({ isSkipAds: skipStatus }) => {
	isSkipAds = skipStatus;
});

const onStorageChange = (changes) => {
	if (changes['isSkipAds']) {
		isSkipAds = changes['isSkipAds'].newValue;
	}
};
chrome.storage.local.onChanged.addListener(onStorageChange);

const hideVideoAds = () => {
	if (!document.getElementById('yt-extension-style')) {
		const headTag = document.head || document.getElementsByTagName('head')[0];
		if (!headTag)
			return void setTimeout(function () {
				hideVideoAds();
			}, 100);
		const newStyleTag = document.createElement('style');
		newStyleTag.id = 'yt-extension-style';
		newStyleTag.appendChild(
			document.createTextNode(
				`.ad-container,.ad-div,.masthead-ad-control,.video-ads,.ytp-ad-progress-list,#ad_creative_3,#footer-ads,#masthead-ad,#player-ads,.ytd-mealbar-promo-renderer,#watch-channel-brand-div,#watch7-sidebar-ads,ytd-display-ad-renderer,ytd-compact-promoted-item-renderer,.html5-video-player.ad-showing video {display: none !important;}`
			)
		);
		headTag.appendChild(newStyleTag);
	}
};

const observer = new MutationObserver((mutations) => {
	// Browser break time
	if (counter++ % 2 === 0) return;

	// Click close ads overlay
	Array.from(document.querySelectorAll('.ytp-ad-overlay-close-button'))?.forEach((e) =>
		e?.click()
	);

	// Click "Skip ads" button
	const skippableAd = document.querySelectorAll('.ytp-ad-skip-button').length;
	if (skippableAd) {
		Array.from(document.querySelectorAll('.ytp-ad-skip-button'))?.forEach((e) =>
			e?.click()
		);
		return;
	}

	// Skip ads
	const adElement = document.querySelectorAll('.video-ads.ytp-ad-module')[0];
	const videoTag = document.getElementsByTagName('video')[0];
	const adActive = adElement && window.getComputedStyle(adElement).display !== 'none';
	if (adActive) {
		videoTag.playbackRate = 16;
		videoTag.muted = true;
		videoTag.currentTime = 1e9;
	}
});

document.addEventListener('DOMContentLoaded', (event) => {
	if (!isSkipAds) return;

	// Listen DOM is changed
	observer.observe(document.body, { subtree: true, childList: true });
	hideVideoAds();
});
