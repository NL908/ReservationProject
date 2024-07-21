import { Observable, Subscription } from 'rxjs';
import { SFNClient, DescribeExecutionCommand } from '@aws-sdk/client-sfn';
import { SearchCriteria } from '../types/SearchCriteria'

export const searchUrl = "https://wbfh8cpfo8.execute-api.us-east-1.amazonaws.com/alpha/execution"
export const searhchArn = "arn:aws:states:us-east-1:767397950342:stateMachine:MyStateMachine-tdqdsfstd"

export const s3ReservationBukcketKey = {
    "bucket": "awsrevervationbucketdata",
    "key": "reservations.json"
}

export interface PostData {
    input: {
        type: string;
        input: string;
    } | string;
    stateMachineArn: string;
}

export interface ApiDataResult {
    executionArn: string;
    startDate: string
}

const TIMEOUT = 5000; // total timeout in milliseconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const postUrl = (url: string, data: PostData): Observable<ApiDataResult> => {
    return new Observable<ApiDataResult>(observer => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result: ApiDataResult) => {
                observer.next(result);
                observer.complete();
            })
            .catch(error => {
                observer.error(error);
            });
    });
};

export const fetchExecutionDetails = async (executionArn: string): Promise<SearchCriteria[]> => {
    const client = new SFNClient({
        region: 'us-east-1',
        credentials: {
            accessKeyId: 'AKIA3FLD3OODDMP5G7ZQ',
            secretAccessKey: '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',
        },
    })
    const input = {
        executionArn: executionArn
    }
    const command = new DescribeExecutionCommand(input)

    try {
        const startTime = Date.now();
        while (Date.now() - startTime < TIMEOUT) {
            const response = await client.send(command);
            if (response.output) {
                const result = JSON.parse(response.output)
                return result
            }
            await delay(50)
        }
        throw new Error("Operation timed out");
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

export const fetchReservationData = (url: string, data: PostData): Promise<object> => {
    return new Promise((resolve, reject) => {
        const observable: Observable<object> = postUrl(url, data);
        const subscription: Subscription = observable.subscribe({
            next: async responseData => {
                try {
                    const executionArn = responseData.executionArn;
                    const reservationData = await fetchExecutionDetails(executionArn);
                    resolve(reservationData);
                } catch (error) {
                    reject(error);
                } finally {
                    subscription.unsubscribe();
                }
            },
            error: err => {
                reject(err);
                subscription.unsubscribe();
            }
        });
    });
}