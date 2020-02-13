import * as angular from 'angular';
import { appConstants } from '../../models/appConstants';
import { configService } from '../../services/configService';
import { siteInfo } from '../../models/siteInfo';

require("../../appConfig");

class settingsComponentController implements ng.IOnInit
{
    static $inject = ['$scope', 'configService'];

    public info: siteInfo;
    public themes: Array<string>;
    public currentTheme: string;

    constructor(public $scope: ng.IScope, public configService : configService)
    {
        
    }

    public selectTheme(): void
    {
        configService.updateTheme(this.currentTheme);

        location.reload();
    }


    $onInit(): void
    {
        let self = this;
        this.configService.getSiteInfo().then(info =>
        {
            self.info = info;
            self.currentTheme = info.theme;
            self.themes = info.themes.sort();
            self.$scope.$apply();
        });
    }

    
}

class settingsComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;

    constructor()
    {
        this.controller = settingsComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('settings');
        }
    }
}

angular.module(appConstants.appName).component('settings', new settingsComponent());