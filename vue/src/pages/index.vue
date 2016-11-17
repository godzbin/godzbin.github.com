<template>
	<div class="index-page">
		<div class="header">
			<!-- <img src="./../assets/index-header.jpg" alt=""> -->
			<h2>我的测试APP</h2>
		</div>
		<div class="main">
			<div class="main-title">正在上映-豆瓣</div>
			<div class="loading" v-show="loading">
					loading....
			</div>
			<div class="list" v-for="i in articles">
				
				<div class="box">
					<div class="icon"><img v-bind:src=i.images.small alt=""></div>
					<div class="info">
						<p class="title">{{i.title}}</p>
						<p class="average">评分：{{i.rating.average}}</p>
						<p class="genres">类别：{{i.genres.join("、")}}</p>
					</div>
					
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	require('./../assets/css/index.scss');
	export default{
		data(){
			return{
				articles:[],
				loading: true
			}
		},
		mounted: function(){
			this.$http.jsonp("https://api.douban.com/v2/movie/in_theaters?count=10", {}, {
	          headers: {},
	          emulateJSON: true
	        }).then(function(response) {
	        	this.loading = false;
	          this.articles = response.data.subjects
	        }, function(response) {
	          console.log(response);
	        });
		}
	}
</script>