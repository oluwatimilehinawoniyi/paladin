export function formatCoverLetter(text: string) {
	return text.replace(/\\n/g, '\n').replace(/\\r/g, '\r').trim();
}
