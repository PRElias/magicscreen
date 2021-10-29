window.isUpdateAvailable = new Promise(function(resolve, reject) {
	if ('serviceWorker' in navigator) {
		//Add this below content to your HTML page, or add the js file to your page at the very top to register service worker
		if (navigator.serviceWorker.controller) {
		console.log('[PWA Builder] active service worker found, no need to register')
		} else {
		//Register the ServiceWorker
		window.addEventListener('load', function () {
			navigator.serviceWorker.register('/barilochetotal/pwabuilder-sw.js', {
			scope: '/barilochetotal/'
			}).then(function (reg) {
			console.log('Service worker has been registered for scope:' + reg.scope);

			reg.onupdatefound = () => {
				const installingWorker = reg.installing;
				installingWorker.onstatechange = () => {
					switch (installingWorker.state) {
						case 'installed':
							if (navigator.serviceWorker.controller) {
								// new update available
								resolve(true);
							} else {
								// no update available
								resolve(false);
							}
							break;
					}
				};
			};

			});
		});
		var worker = new Worker('/docs/pwabuilder-sw.js');
	
		worker.addEventListener('message', function (e) {
			console.log('Worker said: ', e.data);
		}, false);
	
		worker.postMessage('Worker doing work!');
		}
	} else {
		console.log("Navegador não aceita serviceWorker");
	}
});

// listen to the service worker promise in index.html to see if there has been a new update.
// condition: the service-worker.js needs to have some kind of change - e.g. increment CACHE_VERSION.
window['isUpdateAvailable']
	.then(isAvailable => {
		if (isAvailable) {
			// const toast = this.toastCtrl.create({
			// 	message: 'New Update available! Reload the webapp to see the latest juicy changes.',
			// 	position: 'bottom',
			// 	showCloseButton: true,
			// });
			// toast.present();
			if (confirm("Há uma atualização disponível"))
			{
				document.location.reload(true);
			}
		}
	});