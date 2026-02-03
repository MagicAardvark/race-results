/*
 * Joins a tenant base path with a relative path from the tenant root.
 * Ensures there are no duplicate slashes.
 * Example:
 *   joinTenantPath('/t/org1', '/live') => '/t/org1/live'
 *   joinTenantPath('/t/org1/', 'live') => '/t/org1/live'
 *    joinTenantPath('/', 'live') => '/live'
 */
export const joinTenantPath = (
    tenantBase: string,
    pathFromTenantRoot: string
) => {
    pathFromTenantRoot = pathFromTenantRoot || "/";

    const sanitizedRelativePath = pathFromTenantRoot.startsWith("/")
        ? pathFromTenantRoot.slice(1)
        : pathFromTenantRoot;

    const sanitizedBasePath = tenantBase.endsWith("/")
        ? tenantBase.slice(0, -1)
        : tenantBase;

    return `${sanitizedBasePath}/${sanitizedRelativePath}`;
};
