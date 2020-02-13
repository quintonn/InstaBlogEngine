import * as angular from 'angular';
import { appConstants } from '../../models/appConstants';
import { blogItem } from '../../models/blogItem';
import { siteInfo } from '../../models/siteInfo';
import { configService } from '../../services/configService';
import { httpService } from '../../services/httpService';
import { menuService } from '../../services/menuService';
import { templateService } from '../../services/templateService';



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

        let url = 'content/items.json';
        let name = self.name.replace(/_/g, ' ');

        this.siteInfo = configService.siteInfo;
        this.loadContent(self)

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

                    self.$scope.$apply();

                    break;
                }
            }
        });
    }

    private loadContent(self: entryComponentController): void
    {
        let name = self.name.replace(/ /g, '_').toLowerCase();
        let category = self.category.replace(/ /g, '_').toLowerCase();
        let file = "content/" + category + "/" + name + "/index.html";

        self.httpService.downloadFile(file).then(resp =>
        {
            let newScope = self.$scope.$new(false, self.$scope);
            self.$compile(resp)(newScope, elem =>
            {
                let divPageContent = document.getElementById('divPageContent');

                angular.element(divPageContent).append(elem);
                
                elem.ready(() =>
                {
                    self.setupDisqusComments(category, name);

                    self.templateService.applyTemplate("content/" + category + "/" + name).then(_ =>
                    {
                        let scrollTo = self.$location.search().scrollTo;
                        if (scrollTo != null && scrollTo.length > 0)
                        {
                            self.attemptToScroll(scrollTo);
                        }

                        //self.$scope.$apply();
                    });
                });
            });
        });
    }

    private attemptToScroll(scrollTo: string, count: number = 0): void
    {
        let self = this;

        let existingTags = document.querySelectorAll('a[href$=' + scrollTo + ']');
        console.log(existingTags);

        if (existingTags == null || existingTags.length == 0)
        {
            if (count < 100)
            {
                setTimeout(function ()
                {
                    self.attemptToScroll(scrollTo, count++);
                }, 10);
            }
            return;
        }
            
        self.$anchorScroll(scrollTo);
    }

    private setupDisqusComments(category: string, name: string): void
    {
        let self = this;
        //Setup disqus:
        if (self.siteInfo.disqus && self.siteInfo.disqus.enabled == true)
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