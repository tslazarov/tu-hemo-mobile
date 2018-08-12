export class DateFormatter {
    static toDate(dateString: string): string {
        let date = new Date(dateString);

        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    }
}