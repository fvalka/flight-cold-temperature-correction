<script lang="ts">
    import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
    import { Switch } from "@skeletonlabs/skeleton-svelte";

    let {label, value, unit} = $props();
</script>

<div class="label text-center">
            <span class="label-text">{ label }</span>
            <div class="grid grid-cols-[1fr_auto] pt-1 pb-1">
                <div class="font-mono text-right">{ value }</div> 
                <div class="text-center ml-1 w-10">{ unit }</div>
            </div>
        </div>

<style lang="postcss">
    @reference "tailwindcss";
    :global(html) {
        background-color: theme(--color-gray-100);
    }
</style>

