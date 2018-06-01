describe("Hacker news", function() {
    beforeAll(function() {
        jasmine.Ajax.install();
        var app  = document.createElement('div');
        app.setAttribute('id', 'app');
        document.body.appendChild(app);

        startApp();

        var ids = [];
        for (var i = 1; i <= 30; i++) {
            ids.push(i);
        }

        var request = jasmine.Ajax.requests.filter('https://hacker-news.firebaseio.com/v0/topstories.json').shift();
        var success = {
            status: 200,
            responseText: '[' + ids.join(',')  + ']'
        };
        request.respondWith(success);

        var fakeResponseText = '{"by":"alex_young","descendants":14,"id":17196704,"kids":[17196801,17196953,17197011,17197020],"score":37,"time":1527778073,"title":"China’s SenseTime, the world’s highest-valued AI startup, closes $620M round","type":"story","url":"https://techcrunch.com/2018/05/30/even-more-money-for-senstime-ai-china/"}';
        for (var i in ids) {
            var request = jasmine.Ajax.requests.filter('https://hacker-news.firebaseio.com/v0/item/' + ids[i] + '.json').shift();
            var success = {
                status: 200,
                responseText: fakeResponseText
            };
            request.respondWith(success);
        }

        var request = jasmine.Ajax.requests.filter('https://hacker-news.firebaseio.com/v0/user/alex_young.json').shift();
        var success = {
            status: 200,
            responseText: '{"created": 1364566967,"id": "alex_young","karma": 1363,"submitted": [17198618,17196801]}'
        };
        request.respondWith(success);
    });

    afterAll(function() {
        var app = document.getElementById('app');
        document.body.removeChild(app);
        jasmine.Ajax.uninstall();
    });

    it('Should render the initial list with 30 items', function() {
        var list = document.getElementById('app').getElementsByClassName('list')[0];
        var items = [];
        for (var i in list.getElementsByTagName('li')) {
            if (list.getElementsByTagName('li')[i].className === 'story-item') {
                items.push(list.getElementsByTagName('li')[i])
            }
        }
        expect(items.length).toBe(30);
    });

    it('Should render a link', function() {
        var list = document.getElementById('app').getElementsByClassName('list')[0];
        var item = list.getElementsByTagName('li')[0];
        var links = item.getElementsByClassName('link');
        expect(links.length).not.toBeLessThan(1);
        expect(links[0].href).toBe('https://techcrunch.com/2018/05/30/even-more-money-for-senstime-ai-china/');
    });

    it('Should render score', function() {
        var list = document.getElementById('app').getElementsByClassName('list')[0];
        var item = list.getElementsByTagName('li')[0];
        var scores = item.getElementsByClassName('score');
        expect(scores.length).not.toBeLessThan(1);
        expect(scores[0].innerHTML).toBe('37 points');
    });

    it('Should render time', function() {
        var list = document.getElementById('app').getElementsByClassName('list')[0];
        var item = list.getElementsByTagName('li')[0];
        var times = item.getElementsByClassName('time');
        expect(times.length).not.toBeLessThan(1);
        expect(times[0].innerHTML).toBe('At: 31/05/2018, 16:47');
    });

    it('Should render by', function() {
        var list = document.getElementById('app').getElementsByClassName('list')[0];
        var item = list.getElementsByTagName('li')[0];
        var by = item.getElementsByClassName('by');
        expect(by.length).not.toBeLessThan(1);
        expect(by[0].innerHTML).toContain('alex_young');
    });

    it('Should render a menu', function() {
        var menu = document.getElementById('app').getElementsByClassName('menu')[0];
        var item = menu.getElementsByTagName('li')[0];
        expect(item.length).not.toBeLessThan(2);
    });

    it('Should render a menu with Top active', function() {
        var menu = document.getElementById('app').getElementsByClassName('menu')[0];
        var item = menu.getElementsByTagName('li')[0];
        expect(item.className).toBe('active');
        var link = item.getElementsByTagName('a')[0];
        expect(link.innerHTML).toBe('Top');
    });

    it('Should render a menu with New inactive', function() {
        var menu = document.getElementById('app').getElementsByClassName('menu')[0];
        var item = menu.getElementsByTagName('li')[1];
        expect(item.className).not.toBe('active');
        var link = item.getElementsByTagName('a')[0];
        expect(link.innerHTML).toBe('New');
    });

    it('Should fetch new items on clicking on New', function() {
        var menu = document.getElementById('app').getElementsByClassName('menu')[0];
        var item = menu.getElementsByTagName('li')[1];
        var link = item.getElementsByTagName('a')[0];
        link.click();
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('https://hacker-news.firebaseio.com/v0/newstories.json');
    });

});
