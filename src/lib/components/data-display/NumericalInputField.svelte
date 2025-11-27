<script lang="ts">
    let {label, value, unit, step="1"} = $props();
</script>

<label class="label">
    <span class="label-text text-center">{label}</span>
    <div class="input-group grid-cols-[1fr_auto]">
        <input
            bind:value={value}
            step={step}
            class="ig-input font-mono text-right"
            type="number"
            placeholder=""
        />
        <div class="ig-cell preset-tonal w-10">{unit}</div>
    </div>
</label>