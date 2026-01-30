CREATE VIEW "orgs_active_api_keys_vw" AS (
WITH Ordered AS (
    SELECT
        id,
        api_key,
        org_id,
        api_key_enabled,
        ROW_NUMBER() OVER (PARTITION BY org_id ORDER BY effective_at DESC) as row_num
    FROM public.org_api_keys as apiKey
)

SELECT
    id,
    api_key,
    org_id
FROM Ordered
WHERE
    row_num = 1
AND api_key_enabled = true
);