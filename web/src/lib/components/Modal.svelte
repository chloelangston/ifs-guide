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
		<div id="dialog_desc">
			<slot />
		</div>
		<button class="close-modal" on:click={closeModal} aria-label="Close dialog"> × </button>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal {
		background: white;
		padding: 40px;
		border-radius: 5px;
		position: relative;
		margin: 10px;
		min-width: 80%;
		min-height: 80%;
		overflow: scroll;
		animation: slideUpSmall 0.3s ease-in-out;
	}

	@media (max-width: 768px) {
		.modal {
			min-height: 80%;
			max-height: 90%;
			min-width: 80%;
		}
	}

	@media (min-width: 768px) {
		.modal {
			max-width: 786px;
		}
	}

	.close-modal {
		position: absolute;
		top: 10px;
		right: 10px;
		border: none;
		background: none;
		font-size: 20px;
		cursor: pointer;
	}
</style>
