<script lang="ts">
	export let showMenu = false;
	export let toggleMenu = () => {};
	export let isClosing = false;
	export let setOpenModal: (value: string) => void;
</script>

<div class="sticky-header">
	<div
		class="menu-button"
		role="button"
		tabindex="0"
		aria-expanded={showMenu ? 'true' : 'false'}
		on:click={toggleMenu}
		on:keydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') toggleMenu();
		}}
	>
		?
	</div>
	{#if showMenu}
		<div
			class="menu-options {isClosing ? 'closing' : ''}"
			role="menu"
			aria-hidden={!showMenu}
			on:animationend={() => {
				if (isClosing) {
					showMenu = false;
					isClosing = false;
				}
			}}
		>
			<button role="menuitem" on:click={() => setOpenModal('about')}> About </button>
			<button role="menuitem" on:click={() => setOpenModal('notes')}> Notes </button>
		</div>
	{/if}
</div>
