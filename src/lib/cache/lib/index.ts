export function prependEnvironment(env: string, key: string): string {
    return `${env}:${key}`;
}
