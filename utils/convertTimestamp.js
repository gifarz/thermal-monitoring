import { format } from 'date-fns';

export const formattedDate = (ISODate) => {
    const formattedDate = format(new Date(ISODate), 'yyyy-MM-dd HH:mm:ss');
    
    return formattedDate
}
