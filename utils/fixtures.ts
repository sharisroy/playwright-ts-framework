import {test as base} from '@playwright/test';
import { RequestHandler } from './request_handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './coustom_expect';

export type TestOptions = {
    api: RequestHandler;
}

export const test = base.extend<TestOptions>({
    api: async ({request}, use) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api';
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const api = new RequestHandler(request, baseUrl, logger);
        await use(api);
    }
})