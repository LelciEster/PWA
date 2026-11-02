<script>
	import '../app.css';

	// children = the page that is rendered inside this layout
	let { children } = $props();
</script>

<svelte:head>
	<title>Tafel – Kanban</title>
	<!-- PWA part 1: the manifest makes the app installable -->
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#2f5d50" />
</svelte:head>

{@render children()}
