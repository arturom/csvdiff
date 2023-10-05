<script lang="ts">
    export let files: File[];
    export let onUpdated: (files: File[]) => void;

    function removeFile(file: File) {
        const index = files.indexOf(file);
        if (index !== -1) {
            files.splice(index, 1);
        }
        onUpdated(files);
    }
</script>

<ul>
    {#each files as file}
    <li>
        {file.name}
        <a href="#" on:click={() => removeFile(file)}>remove</a>
    </li>
    {/each}
</ul>