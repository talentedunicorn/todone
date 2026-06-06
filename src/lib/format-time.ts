export function formatTime(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (seconds < 60) return 'just now';
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;

	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	});
}

export function formatTimestamp(iso: string): string {
	return new Date(iso).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
}
