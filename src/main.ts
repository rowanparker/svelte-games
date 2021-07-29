import App from './App.svelte';

const createApp = async () => {

	let props;

	await fetch('/config.json')
		.then(r => r.json())
		.then(j => props = j);

	return new App({
		target: document.body,
		props: props,
	});
};

export default createApp();
