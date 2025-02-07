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

		messages.update((msgs) => [
			...msgs,
			{ role: 'user', content: userMessage, timestamp: formatTime() }
		]);
		input = '';
		isTyping.set(true);
		showOptions.set(false);

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: [...$messages, { role: 'user', content: userMessage }] })
			});

			// ✅ Check if the response is valid JSON
			const text = await res.text();
			try {
				const data = JSON.parse(text);

				if (Array.isArray(data)) {
					for (let i = 0; i < data.length; i++) {
						await new Promise((resolve) => setTimeout(resolve, i === 0 ? 400 : 1200));
						messages.update((msgs) => [
							...msgs,
							{ role: 'assistant', content: data[i].content, timestamp: formatTime() }
						]);
					}
				} else {
					messages.update((msgs) => [
						...msgs,
						{ role: 'assistant', content: data.content, timestamp: formatTime() }
					]);
				}
			} catch (error) {
				console.error('Invalid JSON response:', text);
				messages.update((msgs) => [
					...msgs,
					{
						role: 'assistant',
						content: 'Oops! Something went wrong. Try again.',
						timestamp: formatTime()
					}
				]);
			}
		} catch (error) {
			console.error('API call failed:', error);
			messages.update((msgs) => [
				...msgs,
				{
					role: 'assistant',
					content: "I couldn't reach the server. Please try again later.",
					timestamp: formatTime()
				}
			]);
		} finally {
			isTyping.set(false);
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

    function formatMessage(text: string | null | undefined): string {
		console.log("text: ", text)
        if (!text) return ""; // ✅ Ensure it's always a string

        // Convert bold markdown (**word**) into <strong>word</strong>
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Convert numbered lists (e.g., "1. Item" -> <ol><li>Item</li></ol>)
        text = text.replace(/(\d+)\. (.*?)(?=\n|$)/g, "<p>$2</p>"); // Convert to list items

        // Convert unordered lists (e.g., "- Item" -> <ul><li>Item</li></ul>)
        text = text.replace(/- (.*?)(?=\n|$)/g, "<p>$1</p>"); // Convert to list items

        // Wrap lists in <ul> or <ol> if they exist
        if (text.includes("<li>")) {
            text = text.replace(/(<li>.*?<\/li>)+/gs, "<div>$&</div>"); // Wrap in <ul>
        }

        return text.replace(/\n/g, "<br>"); // Preserve line breaks
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
					{@html formatMessage(msg.content)}
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
