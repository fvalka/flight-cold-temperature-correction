<div class="border w-200 m-4 pl-8 pr-8 pt-7 pb-7 shadow-xl bg-white rounded">
    <h1 class="text-2xl font-bold mb-4">Cold Temperature Altitude Correction</h1>

    <p>Please enter the elevation of the aerodrome and the temperature on the ground at the aerodrome.</p>

    <div class="border-t-3 border-b-3 border-sky-800 mb-4 mt-4 pt-2 pb-2">
        <h2 class="text-xl font-semibold">Aerodrome</h2>
        <div class="grid grid-cols-3 gap-1 m-2">
            <label>
                <div>Elevation</div>
                <input type="number" class="border rounded p-2 text-right w-32"><span class="ml-1">ft</span>
            </label>

            <label>
                <div>Ground Temperature</div>
                <input type="number" class="border rounded p-2 text-right w-16"><span class="ml-1">°C</span>
            </label>
            
            <div>
                <div>ISA Difference</div>
            </div>
        </div>
    </div>

    <div class="mb-4 border-b-1">
        <h2 class="text-xl font-semibold">Altitudes to Correct</h2>
        <div class="grid grid-cols-2 gap-1 m-2">
            <label>
                <div>Original Altitude</div>
                <input type="number" class="border rounded p-2 text-right"><span class="ml-1">ft</span>
            </label>

            <div>
                <div>Corrected Altitude</div>
            </div>
        </div>
    </div>

    <div class="mb-4 border-b-1"> 
        <h2 class="text-xl font-semibold">Approach</h2>
        
        <div class="grid grid-cols-2 gap-1 m-2">
            <label>
                <div class="text-amber-700">Original Flight Path Angle</div>
                <input type="number" class="border rounded p-2 text-right"><span class="ml-1">°</span>
            </label>

            <div>
                <div class="text-green-700">Corrected Flight Path Angle</div>
            </div>
        </div>
    </div>

    <div>
        <h2 class="text-xl font-semibold mt-2">Go Around</h2>     

        <div class="grid grid-cols-2 gap-1 m-2">
            <label>
                <div class="text-amber-700">Original Climb Gradient</div>
                <input type="number" class="border rounded p-2 text-right"><span class="ml-1">%</span>
            </label>

            <div>
                <div class="text-green-700">Corrected Climb Gradient</div>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>