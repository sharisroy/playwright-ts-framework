import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import { createSchema } from 'genson-js';


const SCHEMA_BASE_PATH = './response-schemas';
const ajv = new Ajv({ allErrors: true });

export async function validateSchema(dirName: string, fileName: string, responseBody: object, createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);

    if (createSchemaFlag) {
        try {
            const generatedSchema = createSchema(responseBody);
            await fs.mkdir(path.dirname(schemaPath), { recursive: true })
            await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4), 'utf-8');
        } catch (error) {
            throw new Error(`Failed to create schema file ${schemaPath}: ${error}`);
        }
    }

    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);
    const valid = validate(responseBody)
    if (!valid) {
        throw new Error(`Schema validation failed for ${fileName}_schema.json\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n\n` +
            `Actual Response Body:\n` +
            `${JSON.stringify(responseBody, null, 4)}`
        );
    }
}

async function loadSchema(schemaPath: string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        return JSON.parse(schemaContent);
    } catch (error) {
        throw new Error(`Failed to load schema file ${schemaPath}: ${error}`);
    }

}