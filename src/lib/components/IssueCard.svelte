<script>
	// date-fns: nice, readable dates (German locale)
	import { format, formatDistanceToNow, parseISO, endOfDay, isPast } from 'date-fns';
	import { de } from 'date-fns/locale';
	import { LANES, moveIssue, deleteIssue } from '#lib/store.svelte.js';
	import { exportIcs, shareIssue } from '#lib/exporters.js';

	let { issue } = $props(); // the issue object comes from the Lane

	const due = $derived(parseISO(issue.due));
	// Warning: due day is over. Finished issues (Done/Archiv) don't need a warning anymore.
	const overdue = $derived(isPast(endOfDay(due)) && issue.lane !== 'Done' && issue.lane !== 'Archiv');

	// Coloured left edge shows the priority
	const edge = { high: 'border-l-clay', mid: 'border-l-ochre', low: 'border-l-sage' };
</script>

<!-- Drag & Drop part 1: draggable + dragstart stores the issue id in the drag data -->
<article
	draggable="true"
	ondragstart={(e) => e.dataTransfer.setData('text/plain', issue.id)}
	class="cursor-grab rounded border border-l-4 border-line bg-card p-3 shadow-sm active:cursor-grabbing {edge[
		issue.priority
	]} {overdue ? 'bg-clay/10' : ''}"
>
	<div class="flex items-start justify-between gap-2">
		<h3 class="font-serif font-bold">{issue.title}</h3>
		<!-- story points as a little badge -->
		<span
			class="grid size-7 shrink-0 place-items-center rounded-full bg-forest text-xs text-white"
			title="Story Points">{issue.points}</span
		>
	</div>

	{#if issue.description}
		<p class="mt-1 text-sm text-muted">{issue.description}</p>
	{/if}

	<p class="mt-2 text-xs text-muted">Erstellt am {format(parseISO(issue.created), 'dd.MM.yyyy')}</p>
	<p class="text-xs {overdue ? 'font-bold text-clay' : 'text-muted'}">
		{overdue ? '⚠ Überfällig' : 'Fällig'}: {format(due, 'dd.MM.yyyy')}
		({formatDistanceToNow(due, { addSuffix: true, locale: de })})
	</p>

	<div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
		<!-- Fallback for touch screens, where HTML drag & drop does not work -->
		<select
			value={issue.lane}
			onchange={(e) => moveIssue(issue.id, e.target.value)}
			class="rounded border border-line bg-paper px-1 py-0.5"
		>
			{#each LANES as lane}
				<option>{lane}</option>
			{/each}
		</select>
		<button onclick={() => exportIcs(issue)} class="text-forest underline">ICS</button>
		<button onclick={() => shareIssue(issue)} class="text-forest underline">Teilen</button>
		<button onclick={() => deleteIssue(issue.id)} class="ml-auto text-clay underline">Löschen</button>
	</div>
</article>