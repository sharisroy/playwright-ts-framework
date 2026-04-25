import {test as base} from '@playwright/test';
import { RequestHandler } from './request_handler';

export type RequestHandlerType = {
    api: RequestHandler;
}

export const test = base.extend<RequestHandlerType>({
    api: async ({request}, use) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api';
        const api = new RequestHandler(request, baseUrl);
        await use(api);
    }
})