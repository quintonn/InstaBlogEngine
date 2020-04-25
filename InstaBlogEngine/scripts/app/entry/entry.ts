import * as angular from 'angular';
import { appConstants } from '../../models/appConstants';
import { blogItem } from '../../models/blogItem';
import { siteInfo } from '../../models/siteInfo';
import { configService } from '../../services/configService';
import { httpService } from '../../services/httpService';
import { menuService } from '../../services/menuService';
import { templateService } from '../../services/templateService';

var marked = require('marked');


require("../../appConfig");

/*
//@ts-ignore
import * as mytest from '@quintonn/mytest';
*/


class entryComponentController implements ng.IOnInit
{
    static $inject = ['$scope', '$location', '$sce', 'menuService', 'httpService', '$compile', '$anchorScroll', 'templateService'];

    public html: string;
    public title: string;
    public name: string;
    public category: string;
    public date: string;
    public author: string;
    public sourceType: string;

    private siteInfo: siteInfo;

    constructor(public $scope: ng.IScope, public $location: ng.ILocationService,
        public $sce: ng.ISCEService, public menuService: menuService,
        public httpService: httpService, public $compile: angular.ICompileService,
        public $anchorScroll: angular.IAnchorScrollService,
        public templateService: templateService)
    {
        this.html = this.$sce.trustAsHtml("");
    }

    $onInit(): void
    {
        let self = this;

        let url = 'content/items.json?v=2';
        let name = self.name.replace(/_/g, ' ');

        this.siteInfo = configService.siteInfo;

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
                let item = resp[i];
                if (item.name.toLowerCase() == name)
                {
                    self.date = item.date;
                    self.author = item.author;
                    self.category = item.category;
                    self.name = item.name;
                    self.title = item.title;
                    self.sourceType = item.sourceType || "";

                    self.$scope.$apply();

                    break;
                }
            }

            return self.loadContent(self);
        });
    }

    private loadContent(self: entryComponentController): void
    {
        let name = self.name.replace(/ /g, '_').toLowerCase();
        let category = self.category.replace(/ /g, '_').toLowerCase();

        if (self.sourceType == 'markdown')
        {
            self.downloadMarkdown(self, name, category);
        }
        else
        {
            self.downloadHtml(self, name, category);
        }
    }

    private setupMarkdownRenderer(rootPath:string): any
    {
        let self = this;
        let defaultRenderer = new marked.Renderer()
        const renderer = new marked.Renderer();

        renderer.heading = function (text: string, level: any)
        {
            const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

            if (level == 1)
            {
                let headingId = escapedText.toLowerCase().replace(/ /g, '_');
                let url = window.location.hash.split("?")[0];
                let sectionUrl = url + "?scrollTo=" + headingId;

                return `
                    <div class="text-xl lg:text-2xl text-left font-extrabold my-2 md:my-4" ng-attr-id="${headingId}">
                        <a ng-href="${sectionUrl}">
                            ${text}
                        </a>
                    </div>`;
            }

            let largeSize = '';
            let smallSize = '';

            switch (level)
            {
                case 1:
                    largeSize = 'text-xl';
                    smallSize = 'text-lg';
                    break;
                case 2:
                    largeSize = 'text-lg';
                    smallSize = 'text-base';
                    break;
                case 3:
                    largeSize = 'text-base';
                    smallSize = 'text-sm';
                    break;
                case 4:
                    largeSize = 'text-sm';
                    smallSize = 'text-xs';
                    break;
                case 5:
                case 6:
                    largeSize = 'text-xs';
                    smallSize = 'text-xs';
                    break;
                default:
                    largeSize = 'text-lg';
                    smallSize = 'text-base';
                    break;
            }

            return `<div class='${smallSize} lg:${largeSize} text-left font-extrabold my-2 md:my-4'>${text}</div>`;
        };

        renderer.paragraph = (text : string) =>
        {
            return `<div class='text-left'><block>${text}</block></div>`;
        };

        renderer.code = (code: string, infostring: string, escaped: boolean) =>
        {
            let formattedCode = code;
            if (typeof infostring != 'undefined' && infostring != null && infostring.length > 0)
            {
                formattedCode = self.templateService.formatCode(code, infostring);
            }

            return `<div class='text-left'><block><pre class="language-${infostring}"><code class="language-${infostring} inline-block">${formattedCode}</code></pre></block></div>`;
        };

        renderer.strong = (text: string) =>
        {
            return `<span class="font-bold">${text}</span>`;
        };

        renderer.image = (href: string, title: string, text: string) =>
        {
            let path = href;
            return `<link-image src="${path}" image-caption="${title}" image-source="${path}"></link-image>`;
        };

        let listCache: Array<string> = [];

        renderer.list = (body: string, ordered: boolean, start: number) =>
        {
            let listType = '';
            if (ordered == true)
            {
                listType = 'type="number"';
            }
            else
            {
                listType = 'type="bullet"';
            }

            let content = '';
            for (let i = 0; i < listCache.length; i++)
            {
                let item = `<list-item>${listCache[i]}</list-item>`;
                content = content + item;
            }

            let result = `<block class='text-left'><list ${listType}>${content}</list></block>`;

            listCache = [];

            return result;
        };

        renderer.listitem = (text: string, task: boolean, checked: boolean) =>
        {
            listCache.push(text);
            return '';
        };

        renderer.link = (href: string, title: string, text: string) =>
        {
            return `<web-link link="${href}">${text}</web-link>`;
        };

        return renderer;
    }

    private downloadMarkdown(self: entryComponentController, name: string, category: string): void
    {
        let rootPath = "content/" + category + "/" + name + "/";
        var renderer = self.setupMarkdownRenderer(rootPath);
        let file = rootPath + "index.txt";
        self.httpService.downloadFile(file).then(resp =>
        {
            var html = marked(resp, { renderer: renderer });

            self.processHtml(self, html, name, category);
        });
    }

    private downloadHtml(self: entryComponentController, name: string, category: string): void
    {
        let file = "content/" + category + "/" + name + "/index.html";
        self.httpService.downloadFile(file).then(resp =>
        {
            self.processHtml(self, resp, name, category);
        });
    }

    private processHtml(self: entryComponentController, html: string, name: string, category: string)
    {
        let newScope = self.$scope.$new(false, self.$scope);
        self.$compile(html)(newScope, elem =>
        {
            let divPageContent = document.getElementById('divPageContent');

            angular.element(divPageContent).append(elem);

            elem.ready(() =>
            {
                self.setupDisqusComments(category, name);

                let scrollTo = self.$location.search().scrollTo;
                console.log('scroll to = ' + scrollTo);
                if (scrollTo != null && scrollTo.length > 0)
                {
                    console.log('attempting to scroll');
                    self.attemptToScroll(scrollTo);
                }

                self.templateService.applyTemplate("content/" + category + "/" + name).then(_ =>
                {
                    setTimeout(function ()
                    {
                        if (scrollTo != null && scrollTo.length > 0)
                        {
                            console.log('scroll 2');
                            self.attemptToScroll(scrollTo);
                        }
                    }, 100); // wait 100ms to give images time to load
                });
            });
        });
    }

    private attemptToScroll(scrollTo: string, count: number = 0): void
    {
        console.log('inside attempt to scroll: ' + scrollTo);
        let self = this;
        let existingTags = document.querySelectorAll('a[href$=' + scrollTo + ']');

        console.log('tags:', existingTags);

        if (existingTags == null || existingTags.length == 0)
        {
            console.log('inside. count = ' + count);
            if (count < 10)
            {
                setTimeout(function ()
                {
                    console.log('attempt to scroll inside timer');
                    self.attemptToScroll(scrollTo, count+1);
                }, 10);
            }
            return;
        }
        
        //self.$location.hash(scrollTo);
        //self.$anchorScroll();
        
        //self.$location.hash("");
        setTimeout(function ()
        {
            self.$anchorScroll(scrollTo);
            self.$scope.$apply();
        }, 10);
    }

    private setupDisqusComments(category: string, name: string): void
    {
        let self = this;
        //Setup disqus:
        if (self.siteInfo && self.siteInfo.disqus && self.siteInfo.disqus.enabled == true)
        {
            console.log('adding discus to this site with siteName: ' + self.siteInfo.disqus.siteName);

            let w: any = window;

            let disqusConfig = function ()
            {
                this.page.identifier = category + "_" + name;
                this.page.url = self.$location.absUrl();
            };

            if (!w.DISQUS)
            {
                console.log('calling embed, not reset, for disqus');

                w.disqus_config = disqusConfig;

                let d = document, s = d.createElement('script');

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
    }
}

class entryComponent implements ng.IComponentOptions
{
    static $inject = ['httpService'];

    public controller: any;
    public templateUrl: any;;
    public bindings: any;

    constructor()
    {
        this.controller = entryComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('entry');
        };
        this.bindings =
        {
            category: "@",
            title: "@",
            name: "@"
        }
    }
}

angular.module(appConstants.appName).component('entry', new entryComponent());