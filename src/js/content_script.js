// Init settings
let counter = 0;

document.addEventListener('DOMContentLoaded', (event) => {
	const observer = new MutationObserver((mutations) => {
		// Browser break time
		if (counter++ % 2 === 0) return;

		// Click close ads overlay
		Array.from(document.querySelectorAll('.ytp-ad-overlay-close-button'))?.forEach(
			(e) => e?.click()
		);

		// Click "Skip ads" button
		const skippableAd = document.querySelectorAll('.ytp-ad-skip-button').length;
		if (skippableAd) {
			document.querySelectorAll('.ytp-ad-skip-button')?.forEach((e) => e?.click());
			return;
		}

		// Skip ads
		const adElement = document.querySelectorAll('.video-ads.ytp-ad-module')[0];
		const videoTag = document.getElementsByTagName('video')[0];
		const adActive = adElement && window.getComputedStyle(adElement).display !== 'none';
		if (adActive) {
			videoTag.playbackRate = 16;
			videoTag.muted = true;
			videoTag.currentTime = 999999999;
			countAds++;
		}
	});

	// Listen DOM is changed
	observer.observe(document.body, { subtree: true, childList: true });
});
