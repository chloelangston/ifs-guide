<script>
    import Modal from "$lib/components/Modal.svelte";
    import PartCircle from '../components/PartCircle.svelte';
    import { getPartsFromCookies } from '../utils/cookies';
    export let onClose = () => {};

    let parts = getPartsFromCookies();
    console.log("parts: ", parts)
</script>

<Modal  onClose={onClose}>
    {#each parts as part}
        <div class="notes-part-container">
            <PartCircle part={part} />
            <ul>
                <li>Name: {part.name}</li>
                <li>Location: {part.location}</li>
                <li>Type: {part.type}</li>
                <li>Qualities: {part.qualities}</li>
                <li>Relationships: {part.relationships}</li>
            </ul>
        </div>
    {/each}
</Modal>

<style>
    .notes-part-container {
        display: flex;
    }
</style>
