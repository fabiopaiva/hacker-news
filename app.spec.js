jasmine.Ajax.install();

describe("Hacker news", function() {
    beforeEach(function() {
        var list = document.createElement('ul');
        list.classList.add('list');
        document.body.appendChild(list);

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
    });

    afterEach(function() {
        var list = document.querySelector('.list');
        document.body.removeChild(list);
    });

    afterAll(function() {
        jasmine.Ajax.uninstall();
    });

    it('Should render the initial list with 30 items', function() {
        var list = document.querySelector('.list');
        var item = list.querySelectorAll('li');
        expect(item.length).toBe(30);
    });
});
