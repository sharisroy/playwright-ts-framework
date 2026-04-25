import test, { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {
    private request: APIRequestContext
    private logger: APILogger;
    private baseUrl: string | undefined;
    private defaultBaseUrl: string;
    private apiPath: string = '';
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};
    private defaultAuthToken: string;
    private clearAuthFlag: boolean;

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger, authToken: string = '') {
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl;
        this.logger = logger;
        this.defaultAuthToken = authToken;
        this.clearAuthFlag = false;
    }


    url(url: string) {
        this.baseUrl = url;
        return this;
    }
    path(path: string) {
        this.apiPath = path;
        return this;
    }
    params(params: object) {
        this.queryParams = params;
        return this;
    }
    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        // console.log(this.apiHeaders);
        return this;
    }
    body(body: object) {
        this.apiBody = body;
        return this;
    }
    clearAuth() {
        this.clearAuthFlag = true;
        return this;
    }

    async getRequest(statusCode: number) {
        let responseJSON: any;
        const url = this.getURL();
        await test.step(`GET request to ${url} with headers ${JSON.stringify(this.getHeaders())}`, async () => {
            this.logger.logRequest('GET', url, this.getHeaders());
            const response = await this.request.get(url, {
                headers: this.getHeaders()
            });
            this.cleanUpFields();
            const actualStatus = response.status();
            responseJSON = await response.json();

            this.logger.logResponse(actualStatus, response.headers(), responseJSON);
            this.statusCodeValidatator(actualStatus, statusCode, this.getRequest);
        });
        return responseJSON;
    }
    async postRequest(statusCode: number) {
        let responseJSON: any;
        const url = this.getURL();
        await test.step(`POST request to ${url} with headers ${JSON.stringify(this.getHeaders())}`, async () => {
            this.logger.logRequest('POST', url, this.getHeaders(), this.apiBody);
            const response = await this.request.post(url, {
                headers: this.getHeaders(),
                data: this.apiBody
            });
            this.cleanUpFields();
            const actualStatus = response.status();
            responseJSON = await response.json();

            this.logger.logResponse(actualStatus, response.headers(), responseJSON);
            this.statusCodeValidatator(actualStatus, statusCode, this.postRequest);
        });
        return responseJSON;
    }
    async putRequest(statusCode: number) {
        let responseJSON: any;
        const url = this.getURL();
        await test.step(`PUT request to ${url} with headers ${JSON.stringify(this.getHeaders())}`, async () => {
            this.logger.logRequest('PUT', url, this.getHeaders(), this.apiBody);
            const response = await this.request.put(url, {
                headers: this.getHeaders(),
                data: this.apiBody
            });
            this.cleanUpFields();
            const actualStatus = response.status();
            responseJSON = await response.json();

            this.logger.logResponse(actualStatus, response.headers(), responseJSON);
            this.statusCodeValidatator(actualStatus, statusCode, this.putRequest);
        });
        return responseJSON;
    }

    async deleteRequest(statusCode: number) {
        let responseJSON: any;
        const url = this.getURL();
        await test.step(`DELETE request to ${url} with headers ${JSON.stringify(this.getHeaders())}`, async () => {
            this.logger.logRequest('DELETE', url, this.getHeaders());
            const response = await this.request.delete(url, {
                headers: this.getHeaders()
            });
            this.cleanUpFields();
            const actualStatus = response.status();
            this.logger.logResponse(actualStatus, response.headers());
            this.statusCodeValidatator(actualStatus, statusCode, this.deleteRequest);
        });
    }

    private getURL() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value.toString());
        }
        return url.toString();
    }
    private statusCodeValidatator(actualStatusCode: number, expectedStatusCode: number, callingMethod: Function) {
        if (actualStatusCode !== expectedStatusCode) {
            const logs = this.logger.getRecentLogs();
            const errorMessage = new Error(`Expected status code ${expectedStatusCode} but got ${actualStatusCode}.\n\n Recent API Activity: ${logs}`);
            (Error as any).captureStackTrace(errorMessage, callingMethod);
            throw errorMessage
        }
    }

    private getHeaders() {
        if (!this.clearAuthFlag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthToken;
        }
        return this.apiHeaders;
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