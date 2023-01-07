<script lang="ts">
	export let imageEncoding: string | undefined;
	export let modalID: string;
	export let fileName: string;
</script>

<div class="modal" id={modalID}>
	<h5>Preview of {fileName}</h5>
	<img src={imageEncoding?.toString()} alt="modal for {modalID}" />
	<nav>
		<button type="button" data-ui="#{modalID}">Close</button>
	</nav>
</div>

<style>
	h5 {
		margin-bottom: 10px;
	}

	.modal {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		width: 90%;
		overflow-y: scroll;
	}
</style>
