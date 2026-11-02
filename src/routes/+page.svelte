<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<script>
	import { LANES, board } from '$lib/store.svelte.js';
	import { exportCsv } from '$lib/exporters.js';
	import Lane from '$lib/components/Lane.svelte';
	import IssueDialog from '$lib/components/IssueDialog.svelte';

	let dialog; // the IssueDialog component, so we can call dialog.open()
</script>

<div class="mx-auto max-w-7xl p-4 md:p-8">
	<header class="mb-6 flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 class="font-serif text-4xl font-bold">Tafel</h1>
			<p class="text-sm text-muted">Ein ruhiges Kanban-Board – offline und im Browser gespeichert.</p>
		</div>
		<div class="flex gap-2 text-sm">
			<button
				onclick={() => exportCsv(board.issues)}
				class="rounded border border-forest px-3 py-1 text-forest">CSV exportieren</button
			>
			<button onclick={() => dialog.open()} class="rounded bg-forest px-3 py-1 text-white"
				>+ Neues Issue</button
			>
		</div>
	</header>

	<!-- One Lane component per entry in LANES -->
	<main class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		{#each LANES as name}
			<Lane {name} />
		{/each}
	</main>
</div>

<IssueDialog bind:this={dialog} />