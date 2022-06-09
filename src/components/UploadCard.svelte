<script>
    
    import { onMount } from "svelte";
    
    let tags = [
    "lol",
    "bruh",
    "apple",
    "penis",
    "benis" 
  ];
    let addedTags = [];
    const RESULT_LIMIT = 6;
    let query = "";
    let selectedTags = new Set();

    let colors = ["is-success","is-link","is-warning","is-danger","is-primary"];
    
    // onMount(async () => {
    //     const response = await fetch("https://danbooru.donmai.us/tags.json?limit=10000");
    //     const data = await response.json();
    //     for (let i = 0; i < data.length; i++) {
    //         const tokens = data[i].name.split(" ");
    //         const processed = [];
    //         for (const token of tokens) {
    //             let new_tag = token.replace("_"," ");
    //             processed.push(new_tag);
    //         }
    //         tags.push(processed.join(" "));
    //     }   
    // })

    function addTag() {
        addedTags = [...addedTags];
        console.log(addedTags);
    }

    function addToString(string) {
        query += string;
    }

    let matches = [];
    


    async function searchEnter(e) {
        if (e.key == "Enter") {
            await searchForPosts();
        }
    }
    
    function getTags(e) {
        e.currentTarget.value = query;
        selectedTags = new Set();
        if (query.length) {
            let newMatches = [];
            for (let i = 0; i < tags.length; i++) {
                if ((tags[i].startsWith(query) || tags[i].includes(query)) && newMatches.length < RESULT_LIMIT) {
                    
                    newMatches.push(tags[i]);
                }
            }
            matches = newMatches;
        }
    }

</script>
<div class="parent">
    <div>
        <input class="search-bar" bind:value={query} on:input={getTags}  placeholder="Search for tagged posts!" type="search">
        <div class="btns">
        {#each matches as match}
        <button on:click={() => addToString(match)}>{match}</button>
        {/each}
        </div>
    </div>
</div>

<style>
    .parent {
        position:relative;
        
    }

    .btns {
        display:flex;
        flex-direction:column;
    }
    
    .btns button {
        background:transparent;
        border:none;
    }

    .btns button:hover {
        background:white;
    }

    .search-bar {
        display : block;
        width: 80%;
        padding: 7px;
        border-radius : 1px;
        text-align : center;
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box;    /* Firefox, other Gecko */
        box-sizing: border-box;         /* Opera/IE 8+ */
        margin-left : auto;
        margin-right : auto;
        margin-top : 15px;
        background:transparent;
        border-top:1px;
        border-left:1px;
        border-right:1px;
    }

    input {
        font-size:50%;
    }
    
    

</style>