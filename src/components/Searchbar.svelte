
<script>


    import {homePageQuery, searchMatches} from "../stores";

    export let tags;

    function getMatches() {
      let results = [];
      for (let i = 0; i < tags.length; i++) {
        if (results.length > 10) {
          break;
        }
        if (tags[i].startsWith($homePageQuery)) {
          results.push(tags[i]);
        }
      }
      searchMatches.set(results);
    }
    

</script>


<div>
    <div class="field has-addons">
        <div class="control">
          <input class="input" on:input={(e) => {homePageQuery.set(e.target.value); getMatches();}} type="text" placeholder="Search for tagged posts">
        </div>
        <div class="control">
          <a class="button is-success">
              <i class="fa-solid fa-magnifying-glass"></i>
          </a>
        </div>
      </div>
</div>

<style>
    a {
        text-decoration: none;
    }


</style>