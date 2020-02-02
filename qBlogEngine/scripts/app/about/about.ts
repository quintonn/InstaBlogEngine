import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { httpService } from '../../services/httpService';
import { siteInfo } from '../../models/siteInfo';

import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';

require("../../appConfig");

class aboutComponentController implements ng.IOnInit
{
    static $inject = ['$scope', 'httpService', '$compile'];

    public info: siteInfo;

    constructor(public $scope: ng.IScope, public httpService: httpService, public $compile: angular.ICompileService)
    {

    }

    $onInit(): void
    {
        this.loadContent();
        this.loadSiteInfo();
    }

    private loadSiteInfo(): void
    {
        let self = this;

        this.httpService.getSiteInfo().then(info =>
        {
            self.info = info;
            document.title = info.title;
            self.$scope.$apply();
        });
    }

    private loadContent(): void
    {
        let file = "info/about.html";

        let self = this;
        this.httpService.downloadFile(file).then(resp =>
        {
            var newScope = this.$scope.$new(false, this.$scope);
            var dynamicComponent = this.$compile(resp)(newScope);
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

                    var url = "info/" + fileName;
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

                self.findAndUpdateImageLinks('image', 'x-src', 'src');
                self.findAndUpdateImageLinks('imageRef', 'href', 'href');

                self.$scope.$apply();
            }, 100);
        });
    }

    private findAndUpdateImageLinks(className: string, srcAttributeName: string, targetAttributeName: string)
    {
        let items = document.getElementsByClassName(className);

        for (let i = 0; i < items.length; i++)
        {
            let item = items[i];

            let source = item.getAttribute(srcAttributeName);
            let fullUrl = window.location.origin + window.location.pathname + "info/" + source;

            item.setAttribute(targetAttributeName, fullUrl);
        }
    }
}

class aboutComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;

    constructor()
    {
        this.controller = aboutComponentController;
        this.template = require('./about.html');
    }
}

angular.module(appConstants.appName).component('about', new aboutComponent());