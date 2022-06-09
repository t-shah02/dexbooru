
<script>


    import {homePageQuery, searchMatches} from "../stores";

    let tests = [
    "lol",
    "bruh",
    "apple",
    "penis",
    "benis" 
  ];

    function getMatches() {
      let results = [];
      for (let i = 0; i < tests.length; i++) {
        if (tests[i].startsWith($homePageQuery)) {
          results.push(tests[i]);
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