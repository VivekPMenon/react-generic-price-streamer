export interface Time {
    hour: number;
    minute: number;
    seconds: number;
}

export class PollManager {
    private handle: any;

    constructor(private readonly func: () => void|Promise<void>,
                private readonly defaultTimeout: number,
                private readonly changeStart: Time,
                private readonly changeEnd: Time,
                private readonly timeout: number) {
    }

    public start(timeout: number = this.defaultTimeout): void {
        this.handle = setTimeout(async () => {
            if (this.handle) {
                clearTimeout(this.handle);
            }

            const result = this.func();
            if (result !== undefined) {
                await result;
            }

            const now = new Date();
            const time: Time = {
                hour: now.getHours(),
                minute: now.getMinutes(),
                seconds: now.getSeconds()
            }

            const newTimeout: number = (this.isAfter(time, this.changeStart) && this.isBefore(time, this.changeEnd))
                ? this.timeout
                : this.defaultTimeout;

            this.start(newTimeout);

        }, timeout);
    }

    private isAfter(time1: Time, time2: Time): boolean {
        if (time1.hour < time2.hour) {
            return false;
        }

        if (time1.hour > time2.hour) {
            return true;
        }

        if (time1.minute < time2.minute) {
            return false;
        }

        if (time1.minute > time2.minute) {
            return true;
        }

        return time1.seconds > time2.seconds;
    }

    private isBefore(time1: Time, time2: Time): boolean {
        if (time1.hour < time2.hour) {
            return true;
        }

        if (time1.hour > time2.hour) {
            return false;
        }

        if (time1.minute < time2.minute) {
            return true;
        }

        if (time1.minute > time2.minute) {
            return false;
        }

        return time1.seconds < time2.seconds;
    }
}