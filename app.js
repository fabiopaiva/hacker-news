function startApp(){
	var page = 1,
		itemsPerPage = 30,
		storiesList,
		totalItems = 0,
		currentEndpoint = '/v0/topstories.json';

	var app = document.getElementById('app');
	var menu = document.createElement('ul');
	menu.className = 'menu';
	var title = document.createElement('h1');
	title.innerText = 'Hacker News';
	var list = document.createElement('ul');
	list.className = 'list';

	app.appendChild(menu);
	app.appendChild(title);
	app.appendChild(document.createElement('hr'));
	app.appendChild(list);


	loadEndpoint(currentEndpoint);

	function processStory (event) {
		var story = JSON.parse(event.currentTarget.response);
		if (!story) return;
		var list = app.getElementsByClassName('list')[0];
		var storyItem = document.createElement('li');
		storyItem.className = 'story-item';
		var link = createLinkElement(story);

		var subList = document.createElement('ul');
		subList.className = 'story-sub-items';
		var scoreListItem = document.createElement('li');
		scoreListItem.appendChild(createScoreElement(story));
		subList.appendChild(scoreListItem);
		link.appendChild(subList);

		var timeListItem = document.createElement('li');
		timeListItem.appendChild(createTimeElement(story));
		subList.appendChild(timeListItem);
		link.appendChild(subList);

		var clr = document.createElement('div');
		clr.className = 'clr';
		link.appendChild(clr);

		storyItem.appendChild(link);
		list.appendChild(storyItem);

		var getStory = new XMLHttpRequest();
		getStory.addEventListener('load', function(event) {
			var user = JSON.parse(event.currentTarget.response);
			storyItem.appendChild(createByElement(story, user));
		});
		getStory.open('GET', 'https://hacker-news.firebaseio.com/v0/user/' + story.by + '.json');
		getStory.send();
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
		time.innerText = 'At: ' + timeToDate(story.time);
		time.className = 'time';
		return time;
	}

	function timeToDate(time) {
		var date = new Date(time * 1000);
		return ('0' + date.getDate()).slice(-2) + '/' +
			('0' + (date.getMonth() + 1)).slice(-2) + '/' +
			date.getFullYear() + ', ' +
			('0' + date.getHours()).slice(-2) + ':' +
			('0' + date.getMinutes()).slice(-2);
	}

	function createByElement(story, user) {
		var by = document.createElement('div');
		by.className = 'by';
		var a = document.createElement('a');
		a.innerText = 'By: ' + story.by;
		a.setAttribute('href', '#');
		by.appendChild(a);
		var div = document.createElement('div');
		div.style.display = 'none';
		a.onclick = function(event) {
			event.preventDefault();
			div.style.display = div.style.display === 'none' ? '' : 'none' ;
		}
		div.innerHTML = 'Since: ' + timeToDate(user.created);
		if (user.about) {
			var divAbout = document.createElement('div');
			divAbout.innerHTML = user.about;
			div.appendChild(divAbout);
		}
		by.appendChild(div);
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
		var list = app.getElementsByClassName('list')[0];
		list.innerHTML = '';
		for (var i in storiesList.slice(0, itemsPerPage)) {
			renderStory(storiesList[i]);
		}
		createMenu();
		displayLoadMoreButton(totalItems > itemsPerPage);
	}

	function displayLoadMoreButton(display) {
		var exist = app.getElementsByClassName('load-more');
		var linkMore = exist.length ? exist[0] : document.createElement('a');
		if (display) {
			linkMore.setAttribute('href', '#');
			linkMore.className = 'load-more';
			linkMore.innerText = 'Load more';
			linkMore.onclick = loadMore;
			app.appendChild(linkMore);
		} else if (exist.length) {
			app.removeChild(linkMore);
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
		var menu = app.getElementsByClassName('menu')[0];
		menu.innerHTML = '';
		menu.appendChild(createMenuItem('Top', '/v0/topstories.json'));
		menu.appendChild(createMenuItem('New', '/v0/newstories.json'));
		menu.appendChild(createMenuItem('Best', '/v0/beststories.json'));
		menu.appendChild(createMenuItem('Ask', '/v0/askstories.json'));
		menu.appendChild(createMenuItem('Show', '/v0/showstories.json'));
		menu.appendChild(createMenuItem('Job', '/v0/jobstories.json'));
	}

	function createMenuItem(label, endpoint) {
		var li = document.createElement('li');
		li.className = endpoint === currentEndpoint ? 'active' : '';
		var a = document.createElement('a');
		a.setAttribute('href', '#');
		a.onclick = function(event) {
			event.preventDefault();
			endpoint !== currentEndpoint ? loadEndpoint(endpoint) : Function.prototype();
		}
		a.innerText = label;
		li.appendChild(a);
		return li;
	}
};
