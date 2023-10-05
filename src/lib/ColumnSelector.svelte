<script lang="ts">
    export let selectedColumns: Map<string, boolean>;

    function getClassName(bool: boolean) {
        return bool ? 'primary' : 'outline';
    }

    function makeHandler(k: string, v: boolean) {
        return (e: Event) => {
            selectedColumns.set(k, !v);
            selectedColumns = selectedColumns
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
</script>

<div>
    <div>Select the columns you wish to compare</div>
    {#each selectedColumns as [k, v]}
    <a role="button" href="#" class={getClassName(v)} on:click={makeHandler(k, v)}>
        {k}
    </a>
    {/each}
</div>

<style>
    a {
        margin: .1em;
        padding: .2em .4em;
        font-size: .8em;
        min-width: 4em;
        
    }
</style>