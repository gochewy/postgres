import { Output as PulumiOutput } from '@pulumi/pulumi';
import { z } from 'zod';

export const schema = z.object({
    username: z.string(),
    password: z.string(), // TODO: make sure we output this as a secret in pulumi
    privateHost: z.string(),
    privatePort: z.number(),
    publicHost: z.string().nullable(),
    publicPort: z.number().nullable(),
    database: z.string(),
})

type SchemaType = z.infer<typeof schema>;

type Output = {
    [key in keyof SchemaType]: PulumiOutput<SchemaType[key]> | SchemaType[key];
}

export default Output;