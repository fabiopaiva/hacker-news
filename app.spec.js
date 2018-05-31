jasmine.Ajax.install();

describe("Hacker news", function() {
    beforeAll(function() {
        var list = document.createElement('ul');
        list.classList.add('list');
        document.body.appendChild(list);
    })

    afterAll(function() {
        jasmine.Ajax.uninstall();
        var list = document.querySelector('.list');
        document.body.removeChild(list);
    });

    it('Should request data from Hacker news API', function() {
        var request = jasmine.Ajax.requests.first();
        var success = {
            status: 200,
            responseText: '[17196704]'
        };
        request.respondWith(success);
        expect(request.url).toBe('https://hacker-news.firebaseio.com/v0/topstories.json');

        var request = jasmine.Ajax.requests.filter('https://hacker-news.firebaseio.com/v0/item/17196704.json').shift();
        var success = {
            status: 200,
            responseText: '{"by":"alex_young","descendants":14,"id":17196704,"kids":[17196801,17196953,17197011,17197020],"score":37,"time":1527778073,"title":"China’s SenseTime, the world’s highest-valued AI startup, closes $620M round","type":"story","url":"https://techcrunch.com/2018/05/30/even-more-money-for-senstime-ai-china/"}'
        };
        request.respondWith(success);
        expect(request.url).toBe('https://hacker-news.firebaseio.com/v0/item/17196704.json');
    });

    it('Should render the story into the list', function() {
        var list = document.querySelector('.list');
        var item = list.querySelectorAll('li');
        expect(item.length).toBe(1);
    });
});
