<script>
	import { board, moveIssue } from '$lib/store.svelte.js';
	import IssueCard from './IssueCard.svelte';

	let { name } = $props(); // "Do", "Doing", "Done" or "Archiv"

	let over = $state(false); // true while a card is dragged over this lane (for the highlight)

	// $derived = recalculated automatically whenever the board changes
	const issues = $derived(board.issues.filter((i) => i.lane === name));
	const points = $derived(issues.reduce((sum, i) => sum + i.points, 0)); // sum of story points
</script>

<!-- Drag & Drop part 2: the lane is the drop target.
     dragover must call preventDefault(), otherwise the browser does not allow dropping. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
	ondragover={(e) => {
		e.preventDefault();
		over = true;
	}}
	ondragleave={(e) => {
		// ignore the event when we only move over a child (a card) inside the lane
		if (!e.currentTarget.contains(e.relatedTarget)) over = false;
	}}
	ondrop={(e) => {
		e.preventDefault();
		over = false;
		moveIssue(e.dataTransfer.getData('text/plain'), name); // read the id we stored in dragstart
	}}
	class="min-h-64 rounded-lg border-t-4 p-3 transition {over
		? 'border-forest bg-forest/10'
		: 'border-line bg-black/[0.03]'}"
>
	<header class="mb-3 flex items-baseline justify-between">
		<h2 class="font-serif text-lg font-bold">{name}</h2>
		<span class="text-xs text-muted">{issues.length} Issues · {points} SP</span>
	</header>

	<div class="flex flex-col gap-3">
		{#each issues as issue (issue.id)}
			<IssueCard {issue} />
		{/each}
	</div>
</section>