// init settings
let counter = 0;
let isSkip = true;
let config = {
	video: '',
	hide: [],
	click: [],
	time: null,
};

chrome.storage.local.get(['skip'], ({ skip }) => {
	isSkip = skip;
});

chrome.storage.local.get(['storeConfig'], ({ storeConfig }) => {
	if (storeConfig) {
		config = storeConfig;
	}
});

const onStorageChange = (changes) => {
	if (changes['skip']) {
		isSkip = changes['skip'].newValue;
	}
};
chrome.storage.local.onChanged.addListener(onStorageChange);

const hideTag = () => {
	if (!document.getElementById('wetube-extension-style')) {
		let styleString = '';
		if (config.hide.length > 0) {
			styleString = config.hide.join(',');
			styleString += '{display: none !important;}';
		}

		if (styleString === '') {
			return;
		}
		const headTag = document.head || document.getElementsByTagName('head')[0];
		if (!headTag)
			return void setTimeout(function () {
				hideVideoAds();
			}, 100);
		const newStyleTag = document.createElement('style');
		newStyleTag.id = 'wetube-extension-style';
		newStyleTag.appendChild(document.createTextNode(styleString));
		headTag.appendChild(newStyleTag);
	}
};

const autoPauseBlocker = () => {
	const currentDate = new Date();
	const lactMs = currentDate.getTime();
	window._lact = lactMs;
};

const getConfig = async () => {
	try {
		const data = await fetch(
			'https://raw.githubusercontent.com/lupmit/wetube/main/src/js/config.json'
		);

		const newConfig = await data.json();
		config = { ...newConfig, time: Date.now() };

		chrome.storage.local.set({ storeConfig: config });
	} catch (error) {
		console.log(error);
	}
};

const observer = new MutationObserver((mutations) => {
	if (!isSkip) {
		document.getElementById('wetube-extension-style')?.remove();
		return;
	}

	if (config?.time === null) {
		return;
	}

	// browser break time
	if (counter++ % 2 === 0) {
		counter /= 2;
		return;
	}

	// add hide tag
	hideTag();

	// skip ads
	const videoTag = document.getElementsByTagName('video')[0];
	if (document.querySelector(config.video)) {
		videoTag.playbackRate = 16;
		videoTag.muted = true;
		videoTag.currentTime = 1e9;
	}

	// click
	if (config.click.length > 0) {
		config.click.forEach((item) => {
			document.querySelectorAll(item)?.forEach((e) => e?.click());
		});
	}
});

document.addEventListener('DOMContentLoaded', (event) => {
	setInterval(() => {
		autoPauseBlocker();

		if (
			config?.time === null ||
			Math.floor((Date.now() - new Date(config.time)) / (1000 * 60 * 60))
		) {
			getConfig();
		}
	}, 1000);

	// listen DOM is changed
	observer.observe(document.body, { subtree: true, childList: true });
});
