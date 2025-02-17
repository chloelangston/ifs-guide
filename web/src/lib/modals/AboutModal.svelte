<script>
	import Modal from '$lib/components/Modal.svelte';
	export let onClose = () => {};
</script>

<Modal {onClose}>
	<h2>About this app</h2>
	<p>
		Welcome! This app is an AI-based chatbot that engages with you similar to how an IFS therapist
		would. It's uses OpenAI's gpt-4-turbo model. It's a prototype so please send feedback <a
			href="mailto:chloealangston@gmail.com">here</a
		>!
	</p>
	<ul class="about-list">
		<li class="about-list-item">This app is for:</li>
		<li class="about-list-item">
			<span class="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="green"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M20 6L9 17L4 12"></path>
				</svg>
			</span>
			Being led through guided exercises to explore your feelings and patterns.
		</li>
		<li class="about-list-item">
			<span class="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="green"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M20 6L9 17L4 12"></path>
				</svg>
			</span>
			Being used in between sessions with a professional therapist.
		</li>
		<li class="about-list-item">
			<span class="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="green"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M20 6L9 17L4 12"></path>
				</svg>
			</span>
			Learning about Internal Family Systems.
		</li>
	</ul>
	<ul class="about-list">
		<li class="about-list-item">This app is not for:</li>
		<li class="about-list-item">
			<span class="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="red"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</span>
			Saving your data. It will clear when you refresh.
		</li>
		<li class="about-list-item">
			<span class="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="red"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</span>
			Engaging with deep trauma. It will encourage you to speak with your therapist.
		</li>

		<li class="about-list-item">
			<span class="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="red"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</span>
			Discussing self-harm or harm to others. It will encourage you to seek emergency services.
		</li>
	</ul>
</Modal>

<style>
	.about-list {
		list-style: none;
		padding: 0;
	}

	.about-list .about-list-item {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.about-list .about-list-item .icon {
		display: inline-flex;
		align-items: center;
	}
</style>
