import { getHeadersMap } from "./csv-headers";
import { getRows } from "./csv-reader";

interface RowMeta {
  cells: string[];
  containers: number;
}

export class Loader {
  private columns: string[];
  private files: Map<string, number>;
  private results: Map<string, RowMeta>;
  private nextFileID: number;
  private checsumAllFilesContain: number;

  constructor(columns: string[]) {
    this.columns = columns;
    this.results = new Map();
    this.files = new Map();
    this.nextFileID = 1;
    this.checsumAllFilesContain = 0;
  }

  colEntries() {
    return this.columns.entries();
  }

  fileEntries() {
    return this.files.entries();
  }

  async loadFile(file: File) {
    const fileID = this.nextFileID;
    const headersMap = await getHeadersMap(file);
    const colIndices: number[] = this.columns.map((colName) => headersMap.get(colName)) as number[];
    if (colIndices.some((x) => x === undefined)) {
      throw new Error(
        `File ${file.name} does not contain all selected columns`
      );
    }
    for (const row of await getRows(file)) {
      const cells = colIndices.map((i) => row[i]);
      const id = cells.join("::");
      const rowMeta = this.results.get(id);
      if (rowMeta === undefined) {
        this.results.set(id, { cells: cells as string[], containers: fileID });
      } else {
        rowMeta.containers |= fileID;
      }
    }
    this.checsumAllFilesContain += fileID;
    this.files.set(file.name, fileID);
    this.nextFileID <<= 1;
  }

  *getDiffs() {
    const checksum = this.checsumAllFilesContain;
    for (const result of this.results) {
      const meta = result[1];
      if (meta.containers !== checksum) {
        yield meta;
      }
    }
  }

  countDiffs() {
    let count = 0;
    for (const _ of this.getDiffs()) {
      count += 1;
    }
    return count;
  }

  printDiffs() {
    const fileIDs = Array.from(this.files.values());
    console.log(this.columns.concat(Array.from(this.files.keys())));
    for (const { cells, containers } of this.getDiffs()) {
      const filesIncludedIn = fileIDs.map((id) =>
        (id & containers) === 0 ? "true" : "false"
      );
      console.log(cells.concat(filesIncludedIn));
    }
  }

  async saveDiffFile() {
    const newHandle = await window.showSaveFilePicker();
    const writableStream = await newHandle.createWritable();
    await writableStream.write("This is my file content");
    await writableStream.close();
  }
}
