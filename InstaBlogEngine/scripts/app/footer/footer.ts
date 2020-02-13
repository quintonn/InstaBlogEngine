import * as angular from 'angular';
// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { siteInfo } from '../../models/siteInfo';
import { configService } from '../../services/configService';


require("../../appConfig");

class footerComponentController implements ng.IOnInit
{
    static $inject = ['$scope', 'configService'];

    public siteInfo: siteInfo;

    constructor(public $scope: ng.IScope,   public configService: configService)
    {
        
    }

    $onInit(): void
    {
        let self = this;
        this.configService.getSiteInfo().then(info =>
        {
            self.siteInfo = info;
            self.$scope.$apply();
        });
    }
}

class footerComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;

    constructor()
    {
        this.controller = footerComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('footer');
        };
    }
}

angular.module(appConstants.appName).component('footer', new footerComponent());