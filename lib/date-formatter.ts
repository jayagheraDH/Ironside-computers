export function dateFormatter(date: any) {
    const dateObject = new Date(date);
    const formattedDate = `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear().toString().slice(-2)}`;
    return formattedDate
}