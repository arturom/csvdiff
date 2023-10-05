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

    function makeHandler(i: number) {
        return (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            files.splice(i, 1);
            onUpdated(files);
            return false;
        }
    }
</script>

<ul>
    {#each files as file, i}
    <li>
        {file.name}
        <a href="#" on:click={makeHandler(i)}>remove</a>
    </li>
    {/each}
</ul>