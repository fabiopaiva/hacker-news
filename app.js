// This is just a simple sample code to show you the usage of the api
// Feel free to rewrite and improve or delete and start from scratch

(function(){
	var page = 1,
		itemsPerPage = 30,
		storiesList,
		totalItems = 0;

	function processStory (event) {
		var story = JSON.parse(event.currentTarget.response);
		var list = document.getElementsByClassName('list')[0];
		var storyItem = document.createElement('li');
		storyItem.appendChild(createLinkElement(story));
		storyItem.appendChild(createScoreElement(story));
		storyItem.appendChild(createTimeElement(story));
		storyItem.appendChild(createByElement(story));
		list.appendChild(storyItem);
	}

	function createLinkElement(story) {
		var link = document.createElement('a');
		link.setAttribute('href', story.url);
		link.setAttribute('target', '_blank');
		link.className = 'link';
		link.innerText = story.title;
		return link;
	}

	function createScoreElement(story) {
		var score = document.createElement('div');
		score.innerText = story.score + ' points';
		score.className = 'score';
		return score;
	}

	function createTimeElement(story) {
		var time = document.createElement('div');
		var date = new Date(story.time * 1000);
		time.innerText = date.toLocaleString();
		time.className = 'time';
		return time;
	}

	function createByElement(story) {
		var by = document.createElement('div');
		by.className = 'by';
		by.innerText = story.by;
		return by;
	}

	function loadMore(event) {
		event.preventDefault();
		if (page < totalItems / itemsPerPage) {
			page += 1;
			var list = document.getElementsByClassName('list')[0];
			list.innerHTML = '';
			var sliced = storiesList.slice(itemsPerPage * (page - 1), itemsPerPage * page);
			for (var i in sliced) {
				renderStory(sliced[i])
			}
		}
	}

	function renderStory (storyId) {
		var getStory = new XMLHttpRequest();
		getStory.addEventListener('load', processStory);
		getStory.open('GET', 'https://hacker-news.firebaseio.com/v0/item/' + storyId + '.json');
		getStory.send();
	}

	function processList (event) {
		storiesList = JSON.parse(event.currentTarget.response);
		totalItems = storiesList.length;
		for (var i in storiesList.slice(0, itemsPerPage)) {
			renderStory(storiesList[i])
		}
		if (totalItems > 0) {
			var linkMore = document.createElement('a');
			linkMore.setAttribute('href', '#');
			linkMore.className = 'load-more';
			linkMore.innerText = 'More';
			linkMore.onclick = loadMore;
			document.getElementById('app').appendChild(linkMore);
		}
	}

	document.addEventListener("DOMContentLoaded", function() {
		var getStoriesListRequest = new XMLHttpRequest();
		getStoriesListRequest.addEventListener('load', processList);
		getStoriesListRequest.open('GET', 'https://hacker-news.firebaseio.com/v0/topstories.json');
		getStoriesListRequest.send();
	});
})();
