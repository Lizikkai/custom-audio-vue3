import dayjs from "dayjs";

export const dateOp = dayjs;

export const transformSecondToTime = (duration: number): string => {
    return dateOp(duration * 1000).format('mm:ss');
};