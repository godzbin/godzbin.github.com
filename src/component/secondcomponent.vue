<template>
	<div id="secondcomponent">
		<h1>I am another page</h1>
		<a > written by {{author}}</a>
		<ul>
			<li v-for="article in articles">
				{{article.title}}-{{article.year}}
			</li>
		</ul>
	</div>
</template>
<script>
  export default {
    data() {
        return {
          author: "godz",
          articles: []
        }
      },
      mounted: function() {
        this.$http.jsonp("https://api.douban.com/v2/movie/top250?count=10", {}, {
          headers: {},
          emulateJSON: true
        }).then(function(response) {
          this.articles = response.data.subjects
        }, function(response) {
          console.log(response);
        });
      }
  }
</script>
<style>
	
</style>