<script>
	import Modal from '$lib/components/Modal.svelte';
	export let onClose = () => {};
</script>

<Modal {onClose}>
	<h2>About this app</h2>
	<p>
		Welcome! This AI-powered chatbot is designed to guide you through Internal Family Systems (IFS) exercises, offering structured prompts and reflections. It is not a therapist, but rather a tool to help you engage with IFS concepts between sessions. The app uses OpenAI’s GPT-4 Turbo and is currently a prototype. Please send any feedback <a target="_blank" rel="noopener noreferrer" href="mailto:chloealangston@gmail.com">here</a>!
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
			Guided exercises to explore your feelings and patterns.
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
			Supporting your IFS journey between sessions with a therapist.
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
			Learning about Internal Family Systems in an interactive way.
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
			Saving your data: everything clears when you refresh.
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
            Processing deep trauma: it will encourage you to talk to your therapist.
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
			Discussing self-harm or harm to others: it will direct you to emergency services.
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
