function startApp(){
	var page = 1,
		itemsPerPage = 30,
		storiesList,
		totalItems = 0,
		currentEndpoint = '/v0/topstories.json';

	function processStory (event) {
		var story = JSON.parse(event.currentTarget.response);
		var list = document.getElementById('app').getElementsByClassName('list')[0];
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
		if (page + 1 < Math.ceil(totalItems / itemsPerPage)) {
			page += 1;
			var list = document.getElementsByClassName('list')[0];
			list.innerHTML = '';
			var sliced = storiesList.slice(itemsPerPage * (page - 1), itemsPerPage * page);
			for (var i in sliced) {
				renderStory(sliced[i])
			}
		} else {
			displayLoadMoreButton(false);
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
		var list = document.getElementById('app').getElementsByClassName('list')[0];
		list.innerHTML = '';
		for (var i in storiesList.slice(0, itemsPerPage)) {
			renderStory(storiesList[i]);
		}
		createMenu();
		displayLoadMoreButton(totalItems > itemsPerPage);
	}

	function displayLoadMoreButton(display) {
		var exist = document.getElementById('app').getElementsByClassName('load-more');
		var linkMore = exist.length ? exist[0] : document.createElement('a');
		if (display) {
			linkMore.setAttribute('href', '#');
			linkMore.className = 'load-more';
			linkMore.innerText = 'More';
			linkMore.onclick = loadMore;
			document.getElementById('app').appendChild(linkMore);
		} else if (exist.length) {
			document.getElementById('app').removeChild(linkMore);
		}
	}

	function loadEndpoint(endpoint) {
		currentEndpoint = endpoint;
		page = 1;
		var getStoriesListRequest = new XMLHttpRequest();
		getStoriesListRequest.addEventListener('load', processList);
		getStoriesListRequest.open('GET', 'https://hacker-news.firebaseio.com' + endpoint);
		getStoriesListRequest.send();
	}

	function createMenu() {
		var menu = document.getElementById('app').getElementsByClassName('menu')[0];
		menu.innerHTML = '';
		menu.appendChild(createMenuItem('Top', '/v0/topstories.json'));
		menu.appendChild(createMenuItem('New', '/v0/newstories.json'));
	}

	function createMenuItem(label, endpoint) {
		var li = document.createElement('li');
		li.className = endpoint === currentEndpoint ? 'active' : '';
		var a = document.createElement('a');
		a.setAttribute('href', '#');
		a.onclick = function() {
			loadEndpoint(endpoint);
		}
		a.innerText = label;
		li.appendChild(a);
		return li;
	}

	loadEndpoint(currentEndpoint);
};
