<div class="border w-200 m-4 p-2">
    <h1>Cold Temperature Altitude Correction</h1>

    <div>
        <h2>Aerodrome</h2>
        <div class="grid grid-cols-2 gap-1 m-2 w-200">
            <label>
                <div>Elevation of the Aerodrome</div>
                <input type="number" class="border rounded p-2">
            </label>

            <label>
                <div>Temperature at the Aerodrome</div>
                <input type="number" class="border rounded p-2">
            </label>
        </div>
    </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>