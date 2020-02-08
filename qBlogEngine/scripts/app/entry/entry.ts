import * as angular from 'angular';
// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { menuService } from '../../services/menuService';
import { httpService } from '../../services/httpService';

import * as Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-csharp'; // to load C-Sharp language
import 'prismjs/components/prism-json'; // to load C-Sharp language
import { blogItem } from '../../models/blogItem';
import { siteInfo } from '../../models/siteInfo';

require("../../appConfig");

class entryComponentController implements ng.IOnInit
{
    static $inject = ['$scope', '$location', '$sce', 'menuService', 'httpService', '$compile', '$anchorScroll', '$window'];

    public html: string;
    public title: string;
    public name: string;
    public category: string;
    public date: string;
    public author: string;

    private siteInfo: siteInfo;

    constructor(public $scope: ng.IScope, public $location: ng.ILocationService,
        public $sce: ng.ISCEService, public menuService: menuService,
        public httpService: httpService, public $compile: angular.ICompileService,
        public $anchorScroll: angular.IAnchorScrollService,
        public $window: any)
    {
        this.html = this.$sce.trustAsHtml("");
    }

    $onInit(): void
    {
        let self = this;

        let url = 'content/items.json';
        let name = self.name.replace(/_/g, ' ');

        this.loadSiteInfo().then(_ => self.loadContent(self));

        this.menuService.checkPath(name);

        //TODO: Don't like that i'm download all the info again, but to pass all of this in the URL makes it too long
        this.httpService.downloadFile(url).then((x) => self.httpService.createBlogItems(x)).catch(err =>
        {
            console.error('unable to download ' + url + ': ' + err);
            return Promise.resolve(null);
        }).then(function (resp: blogItem[])
        {
            for (let i = 0; i < resp.length; i++)
            {
                var item = resp[i];
                if (item.name.toLowerCase() == name)
                {
                    self.date = item.date;
                    self.author = item.author;
                    self.category = item.category;
                    self.name = item.name;
                    self.title = item.title;

                    self.$scope.$apply();

                    break;
                }
            }
        });
    }

    private loadSiteInfo(): Promise<void>
    {
        let self = this;
        return this.httpService.getSiteInfo().then(info =>
        {
            self.siteInfo = info;
            self.$scope.$apply();
            return Promise.resolve();
        });
    }

    private loadContent(self: entryComponentController): void
    {
        let name = self.name.replace(/ /g, '_').toLowerCase();
        let category = self.category.replace(/ /g, '_').toLowerCase();
        let file = "content/" + category + "/" + name + "/index.html";

        self.httpService.downloadFile(file).then(resp =>
        {
            var newScope = self.$scope.$new(false, self.$scope);
            var dynamicComponent = self.$compile(resp)(newScope);
            setTimeout(function ()
            {
                var x = document.getElementById('divPageContent');
                angular.element(x).append(dynamicComponent);

                self.$scope.$apply();

                let codeSamples = document.getElementsByClassName('code-sample');

                for (let i = 0; i < codeSamples.length; i++)
                {
                    let div = codeSamples[i];
                    let fileName = div.getAttribute('name').trim().toLowerCase().replace(/ /g, '_');
                    let classList = div.classList;
                    let lang = "";

                    for (let i = 0; i < classList.length; i++)
                    {
                        let language = classList[i];
                        if (language.startsWith('language'))
                        {
                            lang = language.substring(9);
                        }
                    }

                    var url = "content/" + category + "/" + name + "/" + fileName;
                    self.httpService.downloadFile(url).then(content =>
                    {
                        if (lang != null && lang.trim().length > 0)
                        {
                            let pLang = Prism.languages[lang];
                            let code = Prism.highlight(content, pLang, lang);
                            div.innerHTML = code;
                            Prism.highlightAll();
                        }
                        else
                        {
                            div.innerHTML = content;
                        }
                    });
                }

                self.findAndUpdateImageLinks('image', 'x-src', 'src', category, name);
                self.findAndUpdateImageLinks('imageRef', 'href', 'href', category, name);

                if (self.$location.search().scrollTo)
                {
                    self.$anchorScroll(self.$location.search().scrollTo);
                }

                //Setup disqus:
                if (self.siteInfo.disqus && self.siteInfo.disqus.enabled == true)
                {
                    console.log('adding discus to this site with siteName: ' + self.siteInfo.disqus.siteName);

                    let w: any = self.$window;

                    let disqusConfig = function ()
                    {
                        this.page.identifier = category + "_" + name;
                        this.page.url = self.$location.absUrl();
                    };

                    if (!w.DISQUS)
                    {
                        console.log('calling embed, not reset, for disqus');

                        w.disqus_config = disqusConfig;

                        var d = document, s = d.createElement('script');
                        s.src = 'https://' + self.siteInfo.disqus.siteName + '.disqus.com/embed.js';
                        s.setAttribute('data-timestamp', new Date() + "");
                        (d.head || d.body).appendChild(s);
                    }
                    else
                    {
                        console.log('calling disqus.reset');
                        w.DISQUS.reset({
                            reload: true,
                            config: disqusConfig
                        });
                    }
                }
                else
                {
                    console.log('disqus is not configured for this site');
                }

            }, 100);
        });
    }

    private findAndUpdateImageLinks(className: string, srcAttributeName: string, targetAttributeName: string, category: string, name: string)
    {
        let items = document.getElementsByClassName(className);

        for (let i = 0; i < items.length; i++)
        {
            let item = items[i];

            let source = item.getAttribute(srcAttributeName);
            let fullUrl = window.location.origin + window.location.pathname + "content/" + category + "/" + name + "/" + source;

            item.setAttribute(targetAttributeName, fullUrl);
        }
    }
}

class entryComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;
    public bindings: any;

    constructor()
    {
        this.controller = entryComponentController;
        this.template = require('./entry.html');
        this.bindings =
        {
            category: "@",
            title: "@",
            name: "@"
        }
    }
}

angular.module(appConstants.appName).component('entry', new entryComponent());