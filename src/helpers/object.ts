/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const isObjectEmpty = (obj: any) : boolean => {
    return (obj !== null && obj !== undefined && obj.length > 0);
}