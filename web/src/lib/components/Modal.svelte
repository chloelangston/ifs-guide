<script>
	export let onClose = () => {};

	function closeModal() {
		onClose();
	}
</script>

<div
	class="modal-backdrop"
	on:click={closeModal}
	on:keydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') closeModal();
	}}
	tabindex="0"
	role="button"
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		role="dialog"
		class="modal"
		aria-modal="true"
		aria-labelledby="dialog_label"
		aria-describedby="dialog_desc"
		on:click|stopPropagation
	>
		<!-- <h2 id="dialog_label">Modal title</h2> -->
		<div id="dialog_desc">
			<slot />
		</div>
		<button class="close-modal" on:click={closeModal} aria-label="Close dialog"> × </button>
	</div>
</div>

<!-- on:click|stopPropagation -->
