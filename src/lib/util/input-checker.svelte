<script context="module" lang="ts">
    export function isValidNumber(input: any) {
        return (
            input !== undefined &&
            input !== "" &&
            input !== null &&
            !isNaN(input)
        );
    }
</script>
