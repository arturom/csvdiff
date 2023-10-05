<script lang="ts">
    import { getHeadersSet } from './csv-headers';
    import { saveFile } from './csv-writer';
    import { Loader } from './mergediff';
    import ColumnSelector from './ColumnSelector.svelte';
    import DiffTable from './DiffTable.svelte';
    import FilesList from './FilesList.svelte';

    let files: File[] = [];
    let selectedColumns: Map<string, boolean> = new Map();
    let loader: Loader | null = null;

    function setToMap<K, V>(set: Set<K>, fill: V): Map<K, V> {
        const map: Map<K, V> = new Map();
        for (const k of set) {
            map.set(k, fill);
        }
        return map;
    }

    async function onFilesUpdated(newFiles: File[]) {
        const headersSet = await getHeadersSet(newFiles);
        selectedColumns = setToMap(headersSet, false);
        files = newFiles;
        loader = null;
    }

    async function handleFileSelection(e: Event) {
        const target = e.target as any;
        const list: FileList = target.files;
        if (list.length) {
            onFilesUpdated(files.concat(Array.from(list)));
        }
    }

    function getSelectedCols() {
        const cols: string[] = [];
        for (const [a, b] of selectedColumns.entries()) {
            if (b) {
                cols.push(a);
            }
        }
        return cols;
    }

    async function viewDiff() {
        const newLoader = new Loader(getSelectedCols());
        for (const file of files) {
            await newLoader.loadFile(file);
        }
        loader = newLoader;
    }
</script>

<label for="file">Select at least two csv files you wish to compare</label>
<input type="file" name="file" multiple on:change={handleFileSelection}>

<FilesList files={files} onUpdated={onFilesUpdated}/>
<ColumnSelector selectedColumns={selectedColumns}/>

<div>
    <button on:click={viewDiff}>View Diff</button>
    <!--
    <button on:click={saveFile}>Save Diff File</button>
    -->
</div>

{#if loader}
    <DiffTable loader={loader}/>
{/if}