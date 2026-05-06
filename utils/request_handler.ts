import { APIRequestContext, test } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {
    private request: APIRequestContext;
    private logger: APILogger;
    private baseUrl: string | undefined;
    private defaultBaseUrl: string;
    private apiPath: string = '';
    private queryParams: Record<string, any> = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: any = {};
    private defaultAuthToken: string;
    private clearAuthFlag: boolean;

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger, authToken: string = '') {
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl;
        this.logger = logger;
        this.defaultAuthToken = authToken;
        this.clearAuthFlag = false;
    }

    // --- Request Builder Methods ---
    url(url: string) {
        this.baseUrl = url;
        return this;
    }

    path(path: string) {
        this.apiPath = path;
        return this;
    }

    params(params: Record<string, any>) {
        this.queryParams = params;
        return this;
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = { ...this.apiHeaders, ...headers };
        return this;
    }

    body(body: any) {
        this.apiBody = body;
        return this;
    }

    clearAuth() {
        this.clearAuthFlag = true;
        return this;
    }

    // --- Public HTTP Methods ---
    async getRequest(statusCode: number) {
        return this.execute('get', statusCode);
    }

    async postRequest(statusCode: number) {
        return this.execute('post', statusCode);
    }

    async putRequest(statusCode: number) {
        return this.execute('put', statusCode);
    }

    async deleteRequest(statusCode: number) {
        return this.execute('delete', statusCode);
    }

    /**
     * Centralized execution logic for all API requests.
     * Handles logging and report attachments for both success and failed cases.
     */
    private async execute(method: 'get' | 'post' | 'put' | 'delete', expectedStatus: number) {
        const url = this.getURL();
        const headers = this.getHeaders();
        const requestData = this.apiBody;
        let responseJSON: any;

        return await test.step(`${method.toUpperCase()} request to ${this.apiPath}`, async () => {
            // 1. Log and Attach Request details BEFORE the call
            this.logger.logRequest(method.toUpperCase(), url, headers, requestData);
            await test.info().attach(`Request: ${method.toUpperCase()} ${this.apiPath}`, {
                body: JSON.stringify({ url, headers, payload: requestData }, null, 2),
                contentType: 'application/json'
            });

            // 2. Perform the API call
            const response = await (this.request as any)[method](url, {
                headers: headers,
                data: Object.keys(requestData).length ? requestData : undefined
            });

            const actualStatus = response.status();
            const responseText = await response.text();

            // Safe JSON parsing to prevent crashes on empty or non-JSON bodies
            try {
                responseJSON = responseText ? JSON.parse(responseText) : {};
            } catch {
                responseJSON = { message: 'Response is not valid JSON', raw: responseText };
            }

            // 3. Log and Attach Response details BEFORE status validation
            // This ensures data is in the report even if the status code check fails.
            this.logger.logResponse(actualStatus, response.headers(), responseJSON);
            await test.info().attach(`Response: ${actualStatus} ${this.apiPath}`, {
                body: JSON.stringify({
                    status: actualStatus,
                    headers: response.headers(),
                    body: responseJSON
                }, null, 2),
                contentType: 'application/json'
            });

            // 4. Cleanup and Status Validation
            this.cleanUpFields();
            this.statusCodeValidator(actualStatus, expectedStatus, this.execute);

            return responseJSON;
        });
    }

    private getURL() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value.toString());
        }
        return url.toString();
    }

    private statusCodeValidator(actualStatusCode: number, expectedStatusCode: number, callingMethod: Function) {
        if (actualStatusCode !== expectedStatusCode) {
            const logs = this.logger.getRecentLogs();
            const errorMessage = new Error(`Expected status code ${expectedStatusCode} but got ${actualStatusCode}.\n\nRecent API Activity: \n${logs}`);
            (Error as any).captureStackTrace(errorMessage, callingMethod);
            throw errorMessage;
        }
    }

    private getHeaders() {
        const finalHeaders = { ...this.apiHeaders };
        if (!this.clearAuthFlag) {
            finalHeaders['Authorization'] = finalHeaders['Authorization'] || this.defaultAuthToken;
        }
        return finalHeaders;
    }

    private cleanUpFields() {
        this.apiBody = {};
        this.apiHeaders = {};
        this.queryParams = {};
        this.apiPath = '';
        this.baseUrl = undefined;
        this.clearAuthFlag = false;
    }
}