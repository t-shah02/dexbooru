<script context="module">
    export async function load(request) {
        const query = request.url.searchParams.get("query");
        return {
            props : {query : query}
        }
    }
</script>

<script>
    export let query;

</script>

<h1>Searched for: {query}</h1>  