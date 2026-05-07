/**
 * Integrated GraphQL results are usually merged under `fields.data` (see mock helpers).
 * Some layout payloads expose the query root as `fields.datasource` instead — handle both.
 */
export function getIntegratedDatasource<T extends Record<string, unknown>>(
  fields:
    | {
        data?: { datasource?: T };
        datasource?: T;
      }
    | null
    | undefined
): T | undefined {
  return fields?.data?.datasource ?? fields?.datasource;
}
