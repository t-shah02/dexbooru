<script context="module">
  export async function load({ params, fetch, session, stuff }) {

    return {}
  }
</script>


<script>
  import {fade, slide, scale} from 'svelte/transition';
  import UploadToggle from "../components/toggleUploadCard.svelte";
  import UploadImage from "../components/UploadImage.svelte"
    let imageURL = "";
    let image;
    let placeholder;
    let showImage = false;
    let isFileTooLongError = false;
    let colors = ["is-success","is-link","is-warning","is-danger","is-primary"];
    let triggerModal = false;
    let previewURL = "";

  let files = [];
  $: file = files[0];

  function checkImageLength() {
    if (files.length > 10) {
    isFileTooLongError = true;
    files = [];
    }
    else {
      isFileTooLongError = false;
    }
  }

  function toggleModal() {
    if (!triggerModal) {
      triggerModal = !triggerModal;
    }
    else {
      triggerModal = !triggerModal;
    }
  }

</script>
{#if isFileTooLongError}
<div class="notification is-danger" in:slide out:slide>
  <button class="delete" on:click={checkImageLength}></button>
  PLEASE LIMIT YOUR UPLOADS TO 10 IMAGES OR LESS.
</div>
{/if}
<h1> Make a post </h1>

<div class="upload-card" in:slide out:slide>
  <label for="file is-primary">Upload images:</label>
  <div class="file is-primary">
    <label class="file-label">
      <input class="file-input" type="file" name="image" 	accept="image/png, image/jpeg" bind:files on:change={checkImageLength} id="many"multiple>
      <span class="file-cta">
        <span class="file-icon">
          <i class="fas fa-upload"></i>
        </span>
        <span class="file-label">
          Choose up to 10 images
        </span>
      </span>
    </label>
  </div>
</div>

<div class="files">
  <h2>IMAGE PREVIEW</h2>
  <div class="imagebar">
    {#each files as file}
      <div class="image" in:slide out:slide>
        <div on:click={toggleModal} class="pic" style="background-image : url({URL.createObjectURL(file)})">
          
        </div>
          <div class="arrow">
            <UploadToggle></UploadToggle>
          </div>
      </div>
      {#if triggerModal}
      <div class="modal">
        <div on:click={toggleModal} class="modal-background"></div>
          <div class="modal-content">
              <img src={URL.createObjectURL(file)} alt="" height ="100%"> 
          </div>
        <button class="modal-close is-large" aria-label="close" on:click={toggleModal}></button>
      </div>
      {/if}
    {/each}
  </div>
</div>

<style>

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
      width:max-content;
    }

    .modal-background {
      background-color:rgba(8,8,8,0.8);
    }
    
    div {
      display : block;
      margin-left : auto;
      margin-right : auto;
    }

    .pic {
      margin-top : 5px;
      margin-bottom: 5px;
      width : 99%;
      height : 300px;
      cursor:pointer;
    }

    .text{
      border-radius : 10px;
      text-align : center;
    }

    label {
      font-size:30px;
    }

    .file-label {
      padding-left: 10px;
      padding-right: 10px;
      padding-top:8px;
      padding-bottom:8px;
      left:0;
      right:0;
      margin-left:auto;
      margin-right:auto;
      margin-top:10px;
      margin-bottom: 10px;
      align-self:center;
      overflow:visible;
      background:transparent;
    }

    .file-cta {
      padding-left: 10px;
      padding-right: 10px;
      padding-top:8px;
      padding-bottom:8px;
      left:0;
      right:0;
      margin-left:auto;
      margin-right:auto;
      margin-bottom: 10px;
      align-self:center;
      overflow:visible;
      background:gray;
    }

    .file-label {
      font-size:100%;
    }

    img {
      margin-top : 5px;
      margin-bottom: 5px;
      width : 300px;
      height : 300px;
    }

    h1 {
        text-align : center;
        color : blue;
    }

    h2 {
      left:0;
      right:0;
      padding-top:15px;
      margin-left:auto;
      margin-right:auto;
      margin-top:20px;
      margin-bottom: 10px;
      text-align:center;
    }

    .imagebar {
      display : flex;
      overflow-x: scroll;
      margin-bottom: 50px;
    }

    @media only screen and (max-width: 600px) {
    .imagebar {
      display:grid;
      grid-template-columns: 200px;
      left:0;
      right:0;
      margin-left:auto;
      margin-right:auto;
      align-self:center;
    }
  }

    .image {
    background-color: rgba(246, 72, 147, 0.58);
    border-radius:8px;
    padding:10px;
    font-size: 30px;
    text-align: center;
    margin-top:5px;
    margin-bottom:5px;
    margin-left: 5px;
    margin-right:5px;
    min-width:300px;
    max-width:300px;
    height:500px;
  }

  .upload-card {
        display : block;
        text-align : center;
        background-color : #D0D0D0;
        width : 400px;
        border-radius : 10px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        margin-left : auto;
        margin-right : auto;
        margin-top : 60px;
        transition : all 200ms ease-in-out;
        background-color: #734ae8;
        background-image: linear-gradient(315deg, #734ae8 0%, #89d4cf 74%);
    }

    .upload-card:hover {
        transform : scale(1.01);
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

    .notification {
      position:absolute;
      top:55px;
      height:30px;
      width:100%;
    }

</style>