<script>
    import UploadTags from "../components/UploadCard.svelte";
    import {fade, slide, scale} from 'svelte/transition';
    let showTags = false;

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

</script>

<div class="tag-show-box" on:click={dispTagOnClick}>
    <i id="angle-arrow" class="fa-solid fa-angle-down"></i>
  </div>
  {#if showTags}
    <div in:slide out:slide class="block">
      <UploadTags></UploadTags>
    </div>
  {/if}

<style>
    .tag-show-box {
      cursor:pointer;
    }
</style>