<script lang="ts">
    import type { Loader } from "./mergediff";
    export let loader: Loader;
</script>

<table role="grid">
    <thead>
        <tr>
            {#each loader.colEntries() as entry}
                <th>{entry[1]}</th>
            {/each}
            {#each loader.fileEntries() as entry}
                <th>{entry[0]}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each loader.getDiffs() as row }
            <tr>
                {#each row.cells as cell }
                    <td>{cell}</td>
                {/each}
                {#each loader.fileEntries() as entry}
                    <th>
                        {#if (entry[1] & row.containers) !== 0}
                        ✔
                        {/if}
                    </th>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>