<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, tick } from 'svelte';
	import { formatMessage } from '$lib/utils/messages';
	import { formatTime } from '$lib/utils/time';
	import AboutModal from '$lib/modals/AboutModal.svelte';
	import Menu from '$lib/components/Menu.svelte';

	type PartDataType = {
		color?: string;
		name?: string;
	};

	let input = writable('');
	let messages = writable<
		{ role: string; content: string; timestamp: string; partData: PartDataType }[]
	>([]);
	let isTyping = writable(false);
	let showOptions = writable(false);
	let messagesContainer: HTMLElement;
	let openAboutModal = false;

	// Ensure user always sees the latest message
	const scrollToBottom = async () => {
		if (messagesContainer) {
			await tick();
			messagesContainer.scroll({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	};

	// Update list of messages when new message is sent or received
	const updateMessagesArray = (role: string, content: string, partData?: PartDataType) => {
		messages.update((msgs) => [
			...msgs,
			{ role: role, content: content, timestamp: formatTime(), partData: partData || {} }
		]);
		scrollToBottom();
	};

	// Show initial messages from the assistant
	onMount(() => {
		messages.set([]);

		// Show typing animation before first message
		isTyping.set(true);

		setTimeout(() => {
			updateMessagesArray('assistant', 'Hello. I am your Internal Family Systems (IFS) guide.');
			isTyping.set(false);
		}, 1500);

		setTimeout(() => {
			isTyping.set(true);
		}, 2800);

		setTimeout(() => {
			updateMessagesArray(
				'assistant',
				"Take a deep breath and notice how you're feeling. If you'd like, share what's on your mind—or choose an option below to get started."
			);
			isTyping.set(false);
		}, 3500);

		setTimeout(() => {
			showOptions.set(true);
		}, 4500);
	});

	async function createAssistantMessage(text: string) {
		try {
			const data = JSON.parse(text);

			if (Array.isArray(data)) {
				for (let i = 0; i < data.length; i++) {
					await new Promise((resolve) => setTimeout(resolve, i === 0 ? 400 : 1200));
					updateMessagesArray('assistant', data[i].content);
				}
			} else {
				updateMessagesArray('assistant', data.content);
			}
		} catch (error) {
			console.error('Invalid JSON response:', text);
			updateMessagesArray('assistant', 'Oops! Something went wrong. Try again.');
		}
	}

	async function sendMessage(selectedMessage: string | null = null) {
		let userMessage = selectedMessage || $input;
		if (!userMessage) return;

		updateMessagesArray('user', userMessage);
		input.set('');
		isTyping.set(true);
		showOptions.set(false);

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: [...$messages, { role: 'user', content: userMessage }] })
			});

			const text = await res.text();
			createAssistantMessage(text);
		} catch (error) {
			console.error('API call failed:', error);
			updateMessagesArray('assistant', "I couldn't reach the server. Please try again later.");
		} finally {
			isTyping.set(false);
		}
	}
</script>

<div class="app-container">
	<Menu bind:openAboutModal />
	<div class="chat-container">
		<div bind:this={messagesContainer} class="messages">
			{#each $messages as msg}
				<div class={`message-container ${msg.role}-container`}>
					{#if msg.role === 'assistant'}
						<img src="/therapist-avatar.png" alt="Therapist Avatar" class="avatar" />
					{/if}
					<p class={`message ${msg.role}-message`}>
						{@html formatMessage(msg.content)}
						<span class="timestamp">{msg.timestamp}</span>
					</p>
				</div>
			{/each}

			<div class="message-container assistant-container">
				{#if $isTyping}
					<img src="/therapist-avatar.png" alt="Therapist Avatar" class="avatar" />
					<p class="message assistant-message">
						<span class="typing">
							<span class="dot"></span>
							<span class="dot"></span>
							<span class="dot"></span>
						</span>
					</p>
				{/if}
			</div>
		</div>

		<div>
			{#if $showOptions}
				<div class="user-options">
					<button
						class="option-button"
						on:click={() => sendMessage('Could you tell me about IFS?')}
					>
						Could you tell me about IFS?
					</button>
					<button
						class="option-button"
						on:click={() => sendMessage('Could you lead me through an IFS exercise?')}
					>
						Could you lead me through an IFS exercise?
					</button>
				</div>
			{/if}
		</div>

		<div class="input-container">
			<textarea
				bind:value={$input}
				class="chat-input"
				placeholder="Type a message..."
				rows="1"
				on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
			></textarea>

			<button class="send-button" on:click={() => sendMessage()} aria-label="Send message">
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#007bff"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M22 2L11 13"></path>
					<path d="M22 2L15 22 11 13 2 9z"></path>
				</svg>
			</button>
		</div>
	</div>

	{#if openAboutModal}
		<AboutModal onClose={() => (openAboutModal = false)} />
	{/if}
</div>
