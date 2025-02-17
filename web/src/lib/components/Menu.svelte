<script lang="ts">
	export let openAboutModal = false;
</script>

<div
	role="button"
	class="sticky-header question-icon"
	on:click={() => (openAboutModal = true)}
	on:keydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') openAboutModal = true;
	}}
	tabindex="0"
>
	<div>?</div>
</div>

<style>
	.sticky-header {
		position: fixed;
		top: 10px;
		right: 28px;
		background-color: white;
		width: fit-content;
		z-index: 1;
		border-radius: 6px;
		cursor: pointer;
	}
	.question-icon {
		background-color: #e6e3e3;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
		border-radius: 50px;
		height: 10px;
		width: 10px;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.3s ease;
	}

	.question-icon:hover {
		background-color: #d4d4d4;
	}
</style>
