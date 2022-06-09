<script>
    export let file;
    let triggerModal = false;
    import {fade, slide, scale} from 'svelte/transition';
    function toggleModal() {
    if (!triggerModal) {
      triggerModal = !triggerModal;
    }
    else {
      triggerModal = !triggerModal;
    }
  }

  let tags = [
    "lol",
    "bruh",
    "apple",
    "penis",
    "benis" 
  ];
    let addedTags = new Set();
    const RESULT_LIMIT = 6;
    let query = "";
    let selectedTags = new Set();

    let colors = ["is-success","is-link","is-warning","is-danger","is-primary"];
    let isQueryEmpty = false;
    let isQueryTooLong = false;

    function addToString(string) {
        query = string;
    }

    let matches = [];

    function clearErrors() {
        isQueryEmpty = false;
        isQueryTooLong = false;
    }
    
    function addTag() {
        if (query == "") {
            isQueryEmpty = true;
        }
        else if (query.length > 30) {
            isQueryTooLong = true;
        }

        else {
        isQueryEmpty = false;
        isQueryTooLong = false;
        addedTags.add(query);
        addedTags = new Set(addedTags); 
        console.log(addedTags);
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
        else {
            matches = [];
        }
    }

    let showTags = false;
    let showTags2 = false;

    function dispTagOnClick(e) {
      const clickedElement = e.target;
      const elementType = clickedElement.nodeName;
      let angleIcon;
      if (elementType == "H1" || elementType == "I") {
        const parentNode = clickedElement.parentNode;
        angleIcon = parentNode.querySelector("#angle-arrow");
      }
      else {
        angleIcon = clickedElement.querySelector("#angle-arrow");
      }

      if (showTags) {
        angleIcon.className = "fa-solid fa-angle-down";
      }
      else {
        angleIcon.className = "fa-solid fa-angle-up";
      }
      
      angleIcon.style.paddingLeft = "5px";
      angleIcon.style.paddingRight = "5px";
      angleIcon.style.transform = "translateY(25%)"
      showTags = !showTags;
    }

    function dispTagOnClick2(e) {
      const clickedElement = e.target;
      const elementType = clickedElement.nodeName;
      let angleIcon;
      if (elementType == "H1" || elementType == "I") {
        const parentNode = clickedElement.parentNode;
        angleIcon = parentNode.querySelector("#angle-arrow");
      }
      else {
        angleIcon = clickedElement.querySelector("#angle-arrow");
      }

      if (showTags2) {
        angleIcon.className = "fa-solid fa-angle-down";
      }
      else {
        angleIcon.className = "fa-solid fa-angle-up";
      }
      
      angleIcon.style.paddingLeft = "5px";
      angleIcon.style.paddingRight = "5px";
      angleIcon.style.transform = "translateY(25%)"
      showTags2 = !showTags2;
    }

</script>

<div class="image" in:slide out:slide>
    <div on:click={toggleModal} class="pic" style="background-image : url({URL.createObjectURL(file)})">
      
    </div>
      <div class="arrow">
        <div class="tag-show-box" on:click={dispTagOnClick}>
            <i id="angle-arrow" class="fa-solid fa-angle-down"></i>
          </div>
          {#if showTags}
            <div in:slide out:slide class="block">
                <div class="parent">
                    <div>
                        <input class="search-bar" bind:value={query} on:input={getTags}  placeholder="Search for tagged posts!" type="search">
                        <div class="btns">
                        {#if matches.length}
                          <hr>
                        {/if}
                        {#each matches as match}
                        <button in:slide out:slide on:click={() => addToString(match)}>{match}</button>
                        <hr in:slide out:slide>
                        {/each}
                        </div>
                    </div>
                </div>
                <button on:click={addTag} class="button is-white">ADD TAG</button>
                {#if isQueryEmpty}
                        <div class="notification is-danger" in:slide out:slide>
                        <button class="delete" on:click={clearErrors}></button>
                        <h6 class="upload-limit-msg">Tags cannot be empty.</h6>
                        </div>
                    {/if}
                    {#if isQueryTooLong}
                        <div class="notification is-danger" in:slide out:slide>
                        <button class="delete" on:click={clearErrors}></button>
                        <h6 class="upload-limit-msg">Please limit tags to 30 characters.</h6>
                        </div>
                    {/if}
                <div class="tag-show-box1" on:click={dispTagOnClick2}>
                    <h3 class="show-tag-heading">Show tags</h3>
                    <i id="angle-arrow" class="fa-solid fa-angle-down"></i>
                </div>
                {#if showTags2}
                <div in:slide out:slide class="block">
                    {#each Array.from(addedTags) as tag}
                    <a href="https://google.ca"><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">{tag}</span></a>
                    {/each}
                </div>
                {/if}
            </div>
          {/if}      
      </div>
  </div>
  {#if triggerModal}
      <div in:fade out:fade class="modal">
        <div on:click={toggleModal} class="modal-background"></div>
          <div class="modal-content">
              <img src={URL.createObjectURL(file)} alt="" height ="100%"> 
          </div>
        <button class="modal-close is-large" aria-label="close" on:click={toggleModal}></button>
      </div>
    {/if}
    
<style>
    .tag-show-box1 {
        display:flex;
        justify-content:center;
    }

    .tag {
        margin:5px;
    }

    .show-tag-heading {
        margin-right:10px;
    }

    .button {
        margin-top:5px;
        margin-bottom:5px;
    }
    .modal {
      display: flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      display: flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      height:max-content;
      width:max-content;
    }

    .modal-background {
      background-color:rgba(8,8,8,0.8);
    }
    
    .modal img {
    margin-top: 5px;
    margin-bottom: 5px;
    }
    div {
      display : block;
      margin-left : auto;
      margin-right : auto;
    }

    .pic {
      margin-bottom: 5px;
      width : 100%; 
      height : 300px;
      cursor:pointer;
      background-repeat: no-repeat;
      background-size: cover;
      border-top-left-radius : 8px;
      border-top-right-radius : 8px;
    }
   

    img {
      margin-top : 5px;
      margin-bottom: 5px;
      width : 300px;
      
    }

    .image {
    border-radius:8px;
    padding-bottom:10px;
    font-size: 30px;
    text-align: center;
    margin-top:5px;
    margin-bottom:5px;
    margin-left: 5px;
    margin-right:5px;
    min-width:300px;
    max-width:300px;
    background: linear-gradient(315deg,#ca8ce6, #57dcdf );
    transition : all 150ms ease-in-out;
    
  }

  .image:hover {
    transform : scale(1.03);
  }

    input {
      background-color:transparent;
      border:0px;
    }

    .arrow {
      position:relative;
      left:0;
      right:0;
      margin-left:auto;
      margin-right: auto;
      align-self:center;
    }

    .parent {
        position:relative;
        
    }

    .btns {
        display:flex;
        flex-direction:column;
        margin-top : 10px;
    }

    hr {
      display : block;
      margin-left: auto;
      margin-right : auto;
      width : 80%;
    }
    
    .btns button {
        display : block;
        margin-left: auto;
        margin-right : auto;
        background:transparent;
        border:none;
        font-size : 18px;
        width : 80%;
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
    
    
    .tag-show-box {
      cursor:pointer;
    }

</style>