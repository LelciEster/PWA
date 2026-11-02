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
	const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; // 20261102T101500Z
	const day = issue.due.replaceAll('-', ''); // 2026-11-05 -> 20261105
	const text = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Tafel//Kanban//DE',
		'BEGIN:VEVENT',
		`UID:${issue.id}@tafel`,
		`DTSTAMP:${stamp}`,
		`DTSTART;VALUE=DATE:${day}`,
		`SUMMARY:${issue.title}`,
		`DESCRIPTION:${issue.description.replaceAll('\n', '\\n')}`, // line breaks must be escaped in ICS
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n'); // ICS needs Windows line breaks
	download(`${issue.title}.ics`, 'text/calendar', text);
}

// Web Share API: opens the native share menu. Not every desktop browser has it -> copy as fallback.
// Web Share API: opens the native share menu. Not every desktop browser has it -> copy as fallback.
export async function shareIssue(issue) {
	const text = `${issue.title} (fällig am ${issue.due})\n${issue.description}`;
	try {
		if (navigator.share) {
			await navigator.share({ title: issue.title, text });
		} else {
			await navigator.clipboard.writeText(text);
			alert('Teilen wird nicht unterstützt – Text wurde kopiert.');
		}
	} catch (err) {
		// AbortError = the user just closed the share menu, that is not a real error
		if (err.name !== 'AbortError') alert('Teilen fehlgeschlagen: ' + err.message);
	}
}