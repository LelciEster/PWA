// The whole board state lives here. The ".svelte.js" ending allows runes ($state) outside of components.
// Every component that imports `board` automatically updates when it changes.

export const LANES = ['Do', 'Doing', 'Done', 'Archiv'];
const KEY = 'tafel-issues'; // localStorage key

// Read the saved issues once at start (localStorage only stores strings -> JSON.parse)
function load() {
	try {
		return JSON.parse(localStorage.getItem(KEY)) ?? [];
	} catch {
		return [];
	}
}

// One object with one array. (We mutate the object instead of re-assigning an exported variable.)
// An issue looks like:
// { id, title, description, created, due, points, priority, lane }
export const board = $state({ issues: load() });

// Write everything back after each change (objects -> string with JSON.stringify)
function save() {
	localStorage.setItem(KEY, JSON.stringify(board.issues));
}

// New issues always start in the first lane ("Do")
export function addIssue(data) {
	board.issues.push({
		id: crypto.randomUUID(),
		created: new Date().toISOString(),
		lane: 'Do',
		...data
	});
	save();
}

export function deleteIssue(id) {
	board.issues = board.issues.filter((i) => i.id !== id);
	save();
}

// Used by drag & drop and by the select box on the card
export function moveIssue(id, lane) {
	const issue = board.issues.find((i) => i.id === id);
	if (!issue || issue.lane === lane) return; // unknown id or same lane -> nothing to do

	issue.lane = lane;
	save();

	if (lane === 'Done') notifyDone(issue);
}

// Notification API: first ask for permission, then show the notification
async function notifyDone(issue) {
	if (!('Notification' in window)) return; // browser does not support it
	if (Notification.permission === 'default') await Notification.requestPermission();
	if (Notification.permission === 'granted') {
		new Notification('Erledigt ✓', { body: issue.title, icon: '/icon-192.png' });
	}
}