
<script>
    import PostCard from "../components/PostCard.svelte";
    import Searchbar from "../components/Searchbar.svelte";
    import {slide} from 'svelte/transition';
    import {homePageQuery} from "../stores";
    import Saos from "saos";
    import {onMount} from "svelte";

    onMount(() => homePageQuery.set(""));
    
    

</script>

<h1>Hot posts</h1>

    <div class="post-container">
        <Saos ></Saos>
        <div class="card-row">
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://cdn.donmai.us/sample/6f/e5/__emilia_re_zero_kara_hajimeru_isekai_seikatsu_drawn_by_vodka13__sample-6fe53e532b2a936f4c5418f82b8a6703.jpg"></PostCard>
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://preview.redd.it/xio5uy7g2yp41.jpg?auto=webp&s=62e43266ee0982e5c8337584303520c4014a7b91"></PostCard>
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://cdn.donmai.us/sample/6f/e5/__emilia_re_zero_kara_hajimeru_isekai_seikatsu_drawn_by_vodka13__sample-6fe53e532b2a936f4c5418f82b8a6703.jpg"></PostCard>
        </div>
        <div class="card-row">
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://cdn.donmai.us/sample/6f/e5/__emilia_re_zero_kara_hajimeru_isekai_seikatsu_drawn_by_vodka13__sample-6fe53e532b2a936f4c5418f82b8a6703.jpg"></PostCard>
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://cdn.donmai.us/sample/6f/e5/__emilia_re_zero_kara_hajimeru_isekai_seikatsu_drawn_by_vodka13__sample-6fe53e532b2a936f4c5418f82b8a6703.jpg"></PostCard>
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://cdn.donmai.us/sample/6f/e5/__emilia_re_zero_kara_hajimeru_isekai_seikatsu_drawn_by_vodka13__sample-6fe53e532b2a936f4c5418f82b8a6703.jpg"></PostCard>
        </div>
        <div class="card-row">
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://cdn.donmai.us/sample/6f/e5/__emilia_re_zero_kara_hajimeru_isekai_seikatsu_drawn_by_vodka13__sample-6fe53e532b2a936f4c5418f82b8a6703.jpg"></PostCard>
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://cdn.donmai.us/sample/6f/e5/__emilia_re_zero_kara_hajimeru_isekai_seikatsu_drawn_by_vodka13__sample-6fe53e532b2a936f4c5418f82b8a6703.jpg"></PostCard>
            <PostCard cardTitle="lol" uploader="someone" imageSourceURL="https://rule34.xxx/images/header2.png"></PostCard>
        </div>
    </div>



<style>

    * {
        overflow-x : hidden;
    }

    h1 {
        margin-top : 50px;
        text-align : center;
    }

   
    .post-container {
        display : flex;
        flex-wrap : wrap;
        justify-content: center;
    }



    @keyframes -global-from-left {
        0% {
            transform: rotateX(0deg) translateX(-200vw) skewX(0deg);
        }

        100% {
            transform: rotateX(0deg) translateX(0) skewX(0deg);
        }
    }

    @keyframes -global-from-right {
        0% {
            transform: rotateX(0deg) translateX(200vw) skewX(0deg);
        }
        100% {
            transform: rotateX(0deg) translateX(0) skewX(0deg);
        }
    }

    @keyframes -global-fade-in {
        from {
        opacity: 0;
        }
        to {
        opacity: 1;
        }
  }

</style>