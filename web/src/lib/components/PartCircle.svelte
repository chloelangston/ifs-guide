<script>
	export let part;
</script>

<div class="part-container">
	<div class="part-circle" style="background-color: {part.color}" title={part.name}>
		<p>{part.name}</p>
	</div>
	<button>Find me in your Notes!</button>
</div>

<style>
	.part-container {
		margin-left: 40px;
		display: flex;
	}

	.part-container button {
		border: none;
		background-color: white;
		cursor: pointer;
	}

	.part-circle {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: white;
		text-align: center;
		margin: 5px;
	}
	.part-circle p {
		margin: 0;
		line-height: 1.2;
	}
</style>
