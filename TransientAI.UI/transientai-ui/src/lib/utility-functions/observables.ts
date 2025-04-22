import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function streamToObservable(stream: ReadableStream): Observable<any> {
    return new Observable(subscriber => {
        debugger;
        const reader = stream.getReader();
        function read() {
            reader.read().then(({ done, value }) => {
                if (done) {
                    subscriber.complete();
                    return;
                }
                subscriber.next(value);
                read();
            });
        }
        read();
        return () => reader.cancel();
    });
}

export function fetchDataStream(url: string): Observable<any> {
    return from(fetch(url)).pipe(
        switchMap(response => {
            if (!response.ok) {
                throw new Error(`Error - status = ${response.status}`);
            }
            return streamToObservable(response.body as ReadableStream);
        })
    );
}

export function fromStreamedResponse(response: Promise<Response>): Observable<any> {
    return from(response).pipe(
        switchMap(response => {
            if (!response.ok) {
                throw new Error(`Error - status = ${response.status}`);
            }
            return streamToObservable(response.body as ReadableStream);
        })
    );
}