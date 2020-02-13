import * as angular from 'angular';
import { appConstants } from '../../models/appConstants';
import { siteInfo } from '../../models/siteInfo';
import { configService } from '../../services/configService';
import { httpService } from '../../services/httpService';
import { templateService } from '../../services/templateService';

require("../../appConfig");

class menuItemComponentController implements ng.IOnInit
{
    static $inject = ['$scope', 'httpService', '$compile', 'templateService'];

    public info: siteInfo;
    public path: string;

    constructor(public $scope: ng.IScope, public httpService: httpService, public $compile: angular.ICompileService,
        public templateService: templateService)
    {

    }

    $onInit(): void
    {
        this.loadContent();
        this.info = configService.siteInfo;
    }

    private loadContent(): void
    {
        let file = "info/" + this.path + ".html";

        let self = this;
        this.httpService.downloadFile(file).then(resp =>
        {
            var newScope = this.$scope.$new(false, this.$scope);
            self.$compile(resp)(newScope, elem =>
            {
                let divPageContent = document.getElementById('divPageContent');

                angular.element(divPageContent).append(elem);

                elem.ready(() =>
                {
                    self.templateService.applyTemplate("info");
                });
            });
        }).catch(err =>
        {
            console.error(err);
        });
    }
}

class menuItemComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;
    public bindings: any;

    constructor()
    {
        this.controller = menuItemComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('menuItem');
        }
        this.bindings =
        {
            path: "@",
        };
    }
}

angular.module(appConstants.appName).component('menuItem', new menuItemComponent());