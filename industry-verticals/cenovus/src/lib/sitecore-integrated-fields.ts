/**
 * Integrated GraphQL results are usually merged under `fields.data` (see mock helpers).
 * Some layout payloads expose the query root as `fields.datasource` instead — handle both.
 */
export function getIntegratedDatasource<T>(
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
