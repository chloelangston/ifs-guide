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
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="3" y1="6" x2="21" y2="6"></line>
			<line x1="3" y1="12" x2="21" y2="12"></line>
			<line x1="3" y1="18" x2="21" y2="18"></line>
		</svg>
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
