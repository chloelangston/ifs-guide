<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, tick } from 'svelte';
	import PartCircle from '$lib/components/PartCircle.svelte';
	import { savePartToCookies } from '$lib/utils/cookies';
	import { separateTextAndJson } from '$lib/utils/json';
	import AboutModal from '$lib/modals/AboutModal.svelte';
	import NotesModal from '$lib/modals/NotesModal.svelte';
	import Menu from '$lib/components/Menu.svelte';

	type PartDataType = {
		color?: string,
		name?: string,
	}

	let input = writable('');
	let messages = writable<{ role: string; content: string; timestamp: string, partData: PartDataType }[]>([]);
	let isTyping = writable(false);
	let showOptions = writable(false);
	let messagesContainer: HTMLElement;
	let openModal: string | null = null;
	let showMenu = false;
	let isClosing = false;

	function toggleMenu() {
		if (showMenu) {
			isClosing = true;
		} else {
			showMenu = true;
			isClosing = false;
		}
	}

	function handleModalClose() {
		openModal = null;
	}

	function formatTime() {
		const now = new Date();
		return now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
	}

	const scrollToBottom = async () => {
		if (messagesContainer) {
			await tick();
			messagesContainer.scroll({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	};

	const updateMessagesArray = (role: string, content: string, partData?: PartDataType) => {
		messages.update((msgs) => [...msgs, { role: role, content: content, timestamp: formatTime(), partData: partData || {} }]);
		scrollToBottom();
	};

	onMount(() => {
		console.log('openModal: ', openModal);
		messages.set([]);

		// ✅ Show typing animation before first message
		isTyping.set(true);

		setTimeout(() => {
			updateMessagesArray('assistant', 'Hello. I am your Internal Family Systems (IFS) guide.');
			isTyping.set(false);
		}, 1500); // ⏳ Typing effect for 1.5s before first message appears

		setTimeout(() => {
			isTyping.set(true);
		}, 2800); // ✅ Start second typing animation before the next message

		setTimeout(() => {
			updateMessagesArray(
				'assistant',
				"Take a deep breath and notice how you're feeling. If you'd like, share what's on your mind—or choose an option below to get started."
			);
			isTyping.set(false);
		}, 3500); // ⏳ Typing effect for 1.7s before the second message appears

		setTimeout(() => {
			showOptions.set(true); // ✅ Only show options after the second message
		}, 4500);
	});

	function handlePartResponse(part: any) {
		console.log('handling part response!');
		console.log('part: ', part);
		// Save the part to cookies
		savePartToCookies(part);

		updateMessagesArray("part", "Find me in your Notes!", {color: part.color || "black", name: part.name});
	}

	async function createGuideMessage(text: string) {
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

			// ✅ Check if the response is valid JSON
			const text = await res.text();
			console.log('text: ', text);
			const textAndJson = separateTextAndJson(text);
			console.log('textAndJson: ', textAndJson);
			if (textAndJson.json) handlePartResponse(textAndJson.json);
			createGuideMessage(textAndJson.text);
		} catch (error) {
			console.error('API call failed:', error);
			updateMessagesArray('assistant', "I couldn't reach the server. Please try again later.");
		} finally {
			isTyping.set(false);
		}
	}

	function formatMessage(text: string | null | undefined): string {
		if (!text || typeof text !== 'string') {
			console.error('formatMessage received invalid text:', text);
			return ''; // ✅ Return empty string instead of causing an error
		}

		// Convert bold markdown (**word**) into <strong>word</strong>
		text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

		// Convert numbered lists (e.g., "1. Item" -> <ol><li>Item</li></ol>)
		text = text.replace(/(\d+)\. (.*?)(?=\n|$)/g, '<p>$2</p>'); // Convert to list items

		// Convert unordered lists (e.g., "- Item" -> <ul><li>Item</li></ul>)
		text = text.replace(/- (.*?)(?=\n|$)/g, '<p>$1</p>'); // Convert to list items

		// Wrap lists in <ul> or <ol> if they exist
		if (text.includes('<li>')) {
			text = text.replace(/(<li>.*?<\/li>)+/gs, '<div>$&</div>'); // Wrap in <ul>
		}

		return text.replace(/\n/g, ''); // Preserve line breaks
	}
	$: isAboutModalOpen = openModal === 'about';
	$: isNotesModalOpen = openModal === 'notes';
</script>

<!-- <PartsMap /> -->
<div class="app-container">
	<Menu {showMenu} {toggleMenu} {isClosing} setOpenModal={(value) => (openModal = value)} />
	<div class="chat-container">
		<div bind:this={messagesContainer} class="messages">
			{#each $messages as msg}
				<div
					class={`message-container ${msg.role}-container`}
				>
					{#if msg.role === 'assistant'}
						<img src="/therapist-avatar.png" alt="Therapist Avatar" class="avatar" />
					{/if}
					{#if msg.role === 'part'}
						<PartCircle part={msg.partData} />
					{/if}
					<p class={`message ${msg.role}-message`}>
						{#if msg.role === 'part'}
							<button on:click={() => openModal = "notes"}>{msg.content}</button>
						{:else}
							{@html formatMessage(msg.content)}
						{/if}
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

	{#if isAboutModalOpen}
		<AboutModal onClose={handleModalClose} />
	{/if}

	{#if isNotesModalOpen}
		<NotesModal onClose={handleModalClose} />
	{/if}
</div>
<!-- </div> -->
