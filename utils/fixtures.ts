import {test as base} from '@playwright/test';
import { RequestHandler } from './request_handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './coustom_expect';
import {config} from '../api-test.config';

export type TestOptions = {
    api: RequestHandler;
    config: typeof config;
}

export const test = base.extend<TestOptions>({
    api: async ({request}, use) => {
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const api = new RequestHandler(request, config.apiBaseUrl, logger);
        await use(api);
    },
    config: async ({}, use) => {
        await use(config);
    }
})