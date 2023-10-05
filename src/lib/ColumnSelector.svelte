<script lang="ts">
    export let selectedColumns: Map<string, boolean>;

    function getClassName(bool: boolean) {
        return bool ? 'primary' : 'outline';
    }
</script>

<div>
    <div>Select the columns you wish to compare</div>
    {#each selectedColumns as [k, v]}
    <!--
    <button class={getClassName(v)} on:click={() => {selectedColumns.set(k, !v); selectedColumns = selectedColumns}}>{k}</button>
    -->
    <a role="button" href="#" class={getClassName(v)} on:click={() => {selectedColumns.set(k, !v); selectedColumns = selectedColumns}}>
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