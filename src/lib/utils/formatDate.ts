import { format } from 'date-fns';

export function formatDate(dateString: string): string {
	try {
		return format(new Date(dateString), 'dd-MM-yyyy');
	} catch {
		return 'Unknown date';
	}
}
