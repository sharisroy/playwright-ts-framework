import { APIRequestContext } from "@playwright/test";
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

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl;
        this.logger = logger;
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

    async getRequest(statusCode: number) {
        const url = this.getURL();
        this.logger.logRequest('GET', url, this.apiHeaders);
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        });
        this.cleanUpFields();
        const actualStatus = response.status();
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, response.headers(), responseJSON);
        this.statusCodeValidatator(actualStatus, statusCode, this.getRequest);

        return responseJSON;
    }
    async postRequest(statusCode: number) {
        const url = this.getURL();
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody);
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });
        this.cleanUpFields();
        const actualStatus = response.status();
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, response.headers(), responseJSON);
        this.statusCodeValidatator(actualStatus, statusCode, this.postRequest);
        return responseJSON;
    }
    async putRequest(statusCode: number) {
        const url = this.getURL();
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody);
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });
        this.cleanUpFields();
        const actualStatus = response.status();
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, response.headers(), responseJSON);
        this.statusCodeValidatator(actualStatus, statusCode, this.putRequest);
        return responseJSON;
    }

    async deleteRequest(statusCode: number) {
        const url = this.getURL();
        this.logger.logRequest('DELETE', url, this.apiHeaders);
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        });
        this.cleanUpFields();
        const actualStatus = response.status();
        this.logger.logResponse(actualStatus, response.headers());
        this.statusCodeValidatator(actualStatus, statusCode, this.deleteRequest);
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

    private cleanUpFields() {
        this.apiBody = {};
        this.apiHeaders = {};
        this.queryParams = {};
        this.apiPath = '';
        this.baseUrl = undefined;
    }
}