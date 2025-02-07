<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import PartsMap from '$lib/PartsMap.svelte';

	let input = '';
	let messages = writable<{ role: string; content: string; timestamp: string }[]>([]);
	let isTyping = writable(false);
	let showOptions = writable(false);
	let chatContainer: HTMLElement;
	let isUserScrolling = false; // ✅ Tracks whether user is manually scrolling

	function formatTime() {
		const now = new Date();
		return now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
	}

	onMount(() => {
		messages.set([]);

		// ✅ Show typing animation before first message
		isTyping.set(true);

		setTimeout(() => {
			messages.update((msgs) => [
				...msgs,
				{
					role: 'assistant',
					content: 'Hello. I am your Internal Family Systems (IFS) guide.',
					timestamp: formatTime()
				}
			]);
			isTyping.set(false);
		}, 1500); // ⏳ Typing effect for 1.5s before first message appears

		setTimeout(() => {
			isTyping.set(true);
		}, 2800); // ✅ Start second typing animation before the next message

		setTimeout(() => {
			messages.update((msgs) => [
				...msgs,
				{
					role: 'assistant',
					content:
						"Take a deep breath and notice how you're feeling. If you'd like, share what's on your mind—or choose an option below to get started.",
					timestamp: formatTime()
				}
			]);
			isTyping.set(false);
		}, 3500); // ⏳ Typing effect for 1.7s before the second message appears

		setTimeout(() => {
			showOptions.set(true); // ✅ Only show options after the second message
		}, 4500);
	});

	async function sendMessage(selectedMessage: string | null = null) {
		let userMessage = selectedMessage || input;
		if (!userMessage) return;

		// Add the user's message
		messages.update((msgs) => [
			...msgs,
			{ role: 'user', content: userMessage, timestamp: formatTime() }
		]);
		console.log('chatContainer: ', chatContainer);
		console.log('chatContainer.scrollHeight: ', chatContainer.scrollHeight);
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 50);
		input = '';
		isTyping.set(true);
		showOptions.set(false);

		const res = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: [...$messages, { role: 'user', content: userMessage }] })
		});

		const data = await res.json();
		console.log('data: ', data);
		isTyping.set(false);

		// ✅ Handle multiple AI responses (in case of split messages)
		if (Array.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				const message = data[i];
				console.log('Processing message: ', message);

				// ✅ Reduce delay from 1200ms to 700ms for a faster response flow
				await new Promise((resolve) => setTimeout(resolve, i === 0 ? 400 : 700));

				messages.update((msgs) => [
					...msgs,
					{ role: 'assistant', content: message.content, timestamp: formatTime() }
				]);

				setTimeout(() => {
					if (chatContainer) {
						chatContainer.scrollTop = chatContainer.scrollHeight;
					}
				}, 50);
			}
		} else {
			messages.update((msgs) => [
				...msgs,
				{ role: 'assistant', content: data.content, timestamp: formatTime() }
			]);

			setTimeout(() => {
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}, 50);
		}
	}

	let textareaElement: HTMLTextAreaElement;

	function adjustHeight() {
		if (!textareaElement) return;
		console.log('textareaElement.scrollHeight: ', textareaElement.scrollHeight);

		textareaElement.style.height = 'auto'; // ✅ Reset height to measure correctly
		textareaElement.style.height = `${textareaElement.scrollHeight}px`; // ✅ Expand naturally
	}

	function handleScroll() {
		if (!chatContainer) return;
		const isAtBottom =
			chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;
		isUserScrolling = !isAtBottom;
	}
</script>

<!-- <div style="display: flex; height: 100vh;"> -->
<!-- <PartsMap /> -->
<div class="chat-container">
	{console.log('messages: ', $messages)}
	<div bind:this={chatContainer} class="messages" on:scroll={handleScroll}>
		{#each $messages as msg}
			<div
				class="message-container {msg.role === 'user' ? 'user-container' : 'therapist-container'}"
			>
				{#if msg.role === 'assistant'}
					<img src="/therapist-avatar.png" alt="Therapist Avatar" class="avatar" />
				{/if}
				<p class="message {msg.role === 'user' ? 'user-message' : 'therapist-message'}">
					{msg.content}
					<span class="timestamp">{msg.timestamp}</span>
				</p>
			</div>
		{/each}

		<div class="message-container therapist-container">
			{#if $isTyping}
				<img src="/therapist-avatar.png" alt="Therapist Avatar" class="avatar" />
				<p class="message therapist-message">
					<span class="typing">
						<span class="dot"></span>
						<span class="dot"></span>
						<span class="dot"></span>
					</span>
				</p>
			{/if}
		</div>

		{#if $showOptions}
			<div class="user-options">
				<button class="option-button" on:click={() => sendMessage('Could you tell me about IFS?')}>
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
			bind:value={input}
			class="chat-input"
			placeholder="Type a message..."
			rows="1"
			on:input={adjustHeight}
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
<!-- </div> -->
