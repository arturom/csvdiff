import Papa from "papaparse";

export function previewRows(file: File, preview: number) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      delimiter: ",",
      header: true,
      preview,
      complete: resolve,
    });
  });
}

async function getHeaders(file: File): Promise<string[]> {
  const csv = await previewRows(file, 0);
  return (csv as any).meta.fields as string[];
}

export async function getHeadersMap(file: File): Promise<Map<string, number>> {
  const headers = await getHeaders(file);
  const map = new Map();
  for(const [i, header] of headers.entries()) {
    map.set(header, i);
  }
  return map;
}

export async function loadHeaders(
  existing: Promise<Set<string>> | null,
  file: File
): Promise<Set<string>> {
  if (existing === null) {
    return new Set(await getHeaders(file));
  } else {
    const set = await existing;
    const result: Set<string> = new Set();
    const headers = await getHeaders(file);
    for (const header of headers) {
      if (set.has(header)) {
        result.add(header);
      }
    }
    return result;
  }
}

export async function getHeadersSet(files: File[]): Promise<Set<string>> {
    const set = files.reduce(loadHeaders, null);
    return set === null ? new Set() : set;
}
