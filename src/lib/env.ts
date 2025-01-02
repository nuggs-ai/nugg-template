import { config } from 'dotenv';

export function processEnvVariables(defaultValues: Record<string, string> = {}) {
	const { parsed: envVars } = config() || { parsed: {} };
	const env = envVars || {};

	return Object.keys(env)
		.filter(key => key.startsWith('PUBLIC_'))
		.reduce((acc, key) => ({
			...acc,
			[key]: JSON.stringify(env[key])
		}), {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			...defaultValues
		});
}
