import { test as base } from '@playwright/test';
import { RequestHandler } from './request_handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './custom_expect';
import { config } from '../api-test.config';
import { createToken } from '../helpers/createToken';

export type TestOptions = {
    api: RequestHandler;
    config: typeof config;
}

export type WorkerFixture = {
    authToken: string;
}

export const test = base.extend<TestOptions, WorkerFixture>({
    authToken: [async ({ }, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword);
        await use(authToken);
    }, { scope: 'worker' }],



    api: async ({ request, authToken }, use) => {
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const api = new RequestHandler(request, config.apiBaseUrl, logger, authToken);
        await use(api);
    },
    config: async ({ }, use) => {
        await use(config);
    }
})