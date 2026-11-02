<script>
	import { format } from 'date-fns';
	import { addIssue } from '$lib/store.svelte.js';

	let dialog; // reference to the <dialog> element (set by bind:this)

	// The parent page calls this to show the dialog
	export function open() {
		dialog.showModal();
	}

	// Called when the form is submitted. Because of method="dialog" the browser closes the dialog by itself.
	function save(e) {
		const f = new FormData(e.currentTarget); // reads all inputs by their "name"
		addIssue({
			title: f.get('title'),
			description: f.get('description'),
			due: f.get('due'), // "2026-11-05"
			points: Number(f.get('points')),
			priority: f.get('priority')
		});
		e.currentTarget.reset();
	}

	const input = 'w-full rounded border border-line bg-paper px-2 py-1';
</script>

<!-- m-auto: Tailwind resets the margin, so we centre the dialog again -->
<dialog class="m-auto w-full max-w-md rounded-lg bg-card p-6 backdrop:bg-ink/40">
	<form method="dialog" onsubmit={save} class="flex flex-col gap-3">
		<h2 class="font-serif text-xl font-bold">Neues Issue</h2>

		<label>Titel <input name="title" required class={input} /></label>
		<label>Beschreibung <textarea name="description" rows="3" class={input}></textarea></label>
		<label
			>Fällig am
			<input name="due" type="date" required value={format(new Date(), 'yyyy-MM-dd')} class={input} />
		</label>

		<div class="flex gap-3">
			<label class="flex-1"
				>Story Points
				<input name="points" type="number" min="0" value="1" class={input} />
			</label>
			<label class="flex-1"
				>Priorität
				<select name="priority" class={input}>
					<option value="low">Niedrig</option>
					<option value="mid" selected>Mittel</option>
					<option value="high">Hoch</option>
				</select>
			</label>
		</div>

		<div class="mt-2 flex justify-end gap-2">
			<button type="button" onclick={() => dialog.close()} class="px-3 py-1">Abbrechen</button>
			<button class="rounded bg-forest px-4 py-1 text-white">Anlegen</button>
		</div>
	</form>
</dialog>