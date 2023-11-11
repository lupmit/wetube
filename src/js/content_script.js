// Init settings
let counter = 0;
let isSkipAds = true;
const stylesToHideVideoAds = `.ad-container,.ad-div,.masthead-ad-control,.video-ads,.ytp-ad-progress-list,
#ad_creative_3,#footer-ads,#masthead-ad,#player-ads,.ytd-mealbar-promo-renderer,
#watch-channel-brand-div,#watch7-sidebar-ads,ytd-display-ad-renderer,ytd-ad-slot-renderer
ytd-compact-promoted-item-renderer,.html5-video-player.ad-showing video 
{
  display: none !important;
}`;

chrome.storage.local.get(['skipAds'], ({ skipAds }) => {
	isSkipAds = skipAds;
});

const onStorageChange = (changes) => {
	if (changes['skipAds']) {
		isSkipAds = changes['skipAds'].newValue;
	}
};
chrome.storage.local.onChanged.addListener(onStorageChange);

const hideVideoAds = () => {
	if (!document.getElementById('wetube-extension-style')) {
		const headTag = document.head || document.getElementsByTagName('head')[0];
		if (!headTag)
			return void setTimeout(function () {
				hideVideoAds();
			}, 100);
		const newStyleTag = document.createElement('style');
		newStyleTag.id = 'wetube-extension-style';
		newStyleTag.appendChild(document.createTextNode(stylesToHideVideoAds));
		headTag.appendChild(newStyleTag);
	}
};

const autoPauseBlocker = () => {
	const currentDate = new Date();
	const lactMs = currentDate.getTime();
	window._lact = lactMs;
};

const observer = new MutationObserver((mutations) => {
	autoPauseBlocker();

	// Browser break time
	if (counter++ % 2 === 0) {
		counter /= 2;
		return;
	}

	// Skip ads
	const videoTag = document.getElementsByTagName('video')[0];
	if (document.querySelector('.html5-video-player.ad-showing video')) {
		videoTag.playbackRate = 16;
		videoTag.muted = true;
		videoTag.currentTime = isNaN(videoTag.duration)
			? 1e9
			: Math.ceil(videoTag.duration);
	}

	// Click close ads overlay
	document.querySelectorAll('.ytp-ad-overlay-close-button')?.forEach((e) => e?.click());

	// Click "Skip ads" button
	document.querySelectorAll('.ytp-ad-skip-button')?.forEach((e) => e?.click());

	// Click "No thanks" button
	document.querySelector('[aria-label="No thanks"]')?.forEach((e) => e?.click());
});

document.addEventListener('DOMContentLoaded', (event) => {
	if (!isSkipAds) {
		document.getElementById('wetube-extension-style')?.remove();
		return;
	}

	// Listen DOM is changed
	hideVideoAds();
	observer.observe(document.body, { subtree: true, childList: true });
});
