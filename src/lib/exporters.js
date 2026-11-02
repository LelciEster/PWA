
// Everything that gets data OUT of the app: download helper, CSV, ICS and Web Share.

// Generic download: text -> Blob -> temporary URL -> invisible <a download> that we click
function download(filename, mime, text) {
	const url = URL.createObjectURL(new Blob([text], { type: mime }));
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

// CSV of ALL issues. Every value is wrapped in quotes, inner quotes are doubled ("" = ")
export function exportCsv(issues) {
	const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
	const head = ['Title', 'Description', 'Created', 'Due', 'Points', 'Priority', 'Lane'];
	const rows = issues.map((i) =>
		[i.title, i.description, i.created, i.due, i.points, i.priority, i.lane].map(quote).join(',')
	);
	download('kanban.csv', 'text/csv', [head.join(','), ...rows].join('\n'));
}

// ICS of ONE issue: an all-day calendar event on the due date
export function exportIcs(issue) {
	const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
	const day = issue.due.replaceAll('-', '');

	const text = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Tafel//Kanban//DE',
		'BEGIN:VEVENT',
		`UID:${issue.id}@tafel`,
		`DTSTAMP:${stamp}`,
		`DTSTART;VALUE=DATE:${day}`,
		`SUMMARY:${issue.title}`,
		`DESCRIPTION:${issue.description.replaceAll('\n', '\\n')}`,
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n');

	download(`${issue.title}.ics`, 'text/calendar', text);
}

// Share ONE issue using the native sharing menu or clipboard fallback
export async function shareIssue(issue) {
	const text = `${issue.title} (fällig am ${issue.due})\n${issue.description}`;

	// 1. Try native sharing (mobile and supported browsers)
	if (navigator.share) {
		try {
			await navigator.share({
				title: issue.title,
				text: text
			});
			return;
		} catch (err) {
			// User cancelled sharing
			if (err.name === 'AbortError') return;

			console.error('Native sharing failed:', err);
		}
	}

	// 2. Try copying to clipboard
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			alert('Text wurde kopiert! Du kannst ihn jetzt teilen.');
			return;
		}
	} catch (err) {
		console.error('Clipboard failed:', err);
	}

	// 3. Last fallback: show text for manual copying
	window.prompt('Kopiere diesen Text zum Teilen:', text);
}
