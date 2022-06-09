
<script>
    import {onMount} from "svelte";
    export let imageSourceURL;
    export let cardTitle;
    export let uploader;
    import {fade, slide, scale} from 'svelte/transition';


    let showTags = false;
    let showFront = true;
    
    let colors = ["is-success","is-link","is-warning","is-danger","is-primary"];
    
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

<!-- 
  <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" alt="Avatar" style="width:300px;height:300px;">
      </div>
      <div class="flip-card-back">
          <h1>kjndknvdkn</h1>
      </div>
    </div>
  </div> -->


<div class="card">
    <a href="http://google.ca">
      <div class="card-img" style="background-image : url({imageSourceURL})">  </div>
    </a>
    <div class="post-info-container">
      <h1 class="uploader-title"> Uploader: {uploader} </h1>
      <h1 class="card-title"> {cardTitle}</h1>
    </div>
    <hr>
    <div class="tag-show-box" on:click={dispTagOnClick}>
      <h1 class="show-tag-heading">Show tags</h1>
      <i id="angle-arrow" class="fa-solid fa-angle-down"></i>
    </div>
    {#if showTags}
      <div in:slide out:slide class="block">
        <a href="https://google.ca"><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">tag 1</span></a>
        <a href="https://google.ca"><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">tag 1</span></a>
        <a href="https://google.ca"><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">tag 1</span></a>
        <a href="https://google.ca"><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">tag 1</span></a>
        <a href="https://google.ca"><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">tag 1</span></a>
        <a href="https://google.ca"><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">tag 1</span></a>
      </div>
    {/if}
</div>



<style>
    

    .post-info-container {
      margin-top : 25px;
    }  

    .tag-show-box {
      display : flex;
      justify-content : center;
      padding-bottom: 15px;
    }

    .tag-show-box:hover {
      cursor: pointer;
    }

    .fa-solid {
      transform: translateY(25%);
      padding-left : 5px;
      padding-right : 5px;
      
    }

    .fa-solid:active {
      animation: rotate-arrow 0.5s  linear;
    }

    @keyframes rotate-arrow {
      from {
          -webkit-transform: rotate(0deg);
      
      }
      to {
          -webkit-transform: rotate(180deg);
      }
    }


    @-webkit-keyframes bounce-in-top {
  0% {
    -webkit-transform: translateY(-500px);
            transform: translateY(-500px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateY(-65px);
            transform: translateY(-65px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateY(-28px);
            transform: translateY(-28px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
}
@keyframes bounce-in-top {
  0% {
    -webkit-transform: translateY(-500px);
            transform: translateY(-500px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateY(-65px);
            transform: translateY(-65px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateY(-28px);
            transform: translateY(-28px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
}

    .block {
      display : flex;
      flex-wrap : wrap;
      justify-content: center;
    }

    a {
      text-decoration : none;
    }

    .tag {
      margin : 5px;
      transition : all 100ms ease-in-out;
    }
    
    .tag:hover {
      transform : scale(1.1);
    }

    .show-tag-heading {
      font-size : 18px;
      text-align: center;
    }

    

    .card {
    position:relative;
    background-color : pink;
    margin : 35px;
    border-radius : 10px;
    width : 350px;
    transition : all 350ms;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    -webkit-animation: bounce-in-top 1.1s both;
    animation: bounce-in-top 1.1s both;
    animation-delay: 0;
    animation-fill-mode: none;
  }
  
  .card:hover {
      transform : scale(1.02);
  }

  .card-title {
    text-align : center;
    font-size : 15px;
    margin-top : 2px;
  }
  
  .card-img {
    height: 500px;
    background-size : cover;
    background-repeat : no-repeat;
    border-top-left-radius : 10px;
    border-top-right-radius : 10px;
  }

  .uploader-title {
    text-align : center;
    font-size : 15px;
    margin-top : 10px;
  }
</style>