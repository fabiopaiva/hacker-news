// This is just a simple sample code to show you the usage of the api
// Feel free to rewrite and improve or delete and start from scratch

(function(){
	var page = 1,
		itemsPerPage = 30,
		storiesList;

	function processStory (event) {
		var story = JSON.parse(event.currentTarget.response);
		var list = document.getElementsByClassName('list')[0];
		var storyItem = document.createElement('li');

		var link = document.createElement('a');
		link.setAttribute('href', story.url);
		link.setAttribute('target', '_blank');
		link.className = 'link';
		link.innerText = story.title;
		storyItem.appendChild(link);

		var score = document.createElement('div');
		score.innerText = story.score + ' points';
		score.className = 'score';
		storyItem.appendChild(score);

		var time = document.createElement('div');
		var date = new Date(story.time * 1000);
		time.innerText = date.toLocaleString();
		time.className = 'time';
		storyItem.appendChild(time);

		var by = document.createElement('div');
		by.className = 'by';
		by.innerText = story.by;
		storyItem.appendChild(by);

		list.appendChild(storyItem);
	}

	function renderStory (storyId) {
		var getStory = new XMLHttpRequest();
		getStory.addEventListener('load', processStory);
		getStory.open('GET', 'https://hacker-news.firebaseio.com/v0/item/' + storyId + '.json');
		getStory.send();
	}

	function processList (event) {
		storiesList = JSON.parse(event.currentTarget.response);
		for (var i in storiesList.slice(0, itemsPerPage)) {
			renderStory(storiesList[i])
		}
	}

	document.addEventListener("DOMContentLoaded", function() {
		var getStoriesListRequest = new XMLHttpRequest();
		getStoriesListRequest.addEventListener('load', processList);
		getStoriesListRequest.open('GET', 'https://hacker-news.firebaseio.com/v0/topstories.json');
		getStoriesListRequest.send();
	});
})();
