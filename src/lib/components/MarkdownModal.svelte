<script lang="ts">
	export let renderedMarkdown: string;
</script>

<div class="modal" id="markdown-modal">
	<h5>Your comment written as Markdown</h5>
	<div class="md">
		{@html renderedMarkdown}
	</div>
	<nav class="right-align">
		<button data-ui="#markdown-modal" class="border button">Close</button>
	</nav>
</div>

<style>
	.md {
		margin : 7.5px;
		padding : 5px;
		border : 1px solid black;
		border-radius : 0px;
	}
</style>