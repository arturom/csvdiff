import Papa from "papaparse";

export function readFile(file: File): Promise<Papa.ParseResult<any>> {
    return new Promise((resolve) => {
        Papa.parse(file, {
            delimiter: ",",
            header: false,
            complete: (csv) => resolve(csv) 
        })
    });
}

export async function getRows(file: File): Promise<string[][]> {
    const csv = await readFile(file);
    return csv.data;
}