<script lang="ts">
    let {label, value = $bindable(), unit: unit_of_value, step="1", oninput=null, showerror=false} = $props();

    function generateCssClasses() {
        let border_classes = "border-surface-200-800";
        if(showerror) {
            border_classes = "border-error-300-700";
        }

        return "ig-input font-mono text-right preset-outlined " + border_classes;
    }
</script>

<label class="label">
    <span class="label-text text-center">{label}</span>
    <div class="input-group grid-cols-[1fr_auto]">
        <input
            bind:value={value}
            step={step}
            class={generateCssClasses()}
            type="number"
            placeholder=""
            oninput={oninput}
        />
        <div class="ig-cell preset-tonal w-10">{unit_of_value}</div>
    </div>
</label>