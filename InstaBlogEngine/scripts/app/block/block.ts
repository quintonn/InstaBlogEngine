import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { configService } from '../../services/configService';

require("../../appConfig");

class blockComponentController implements ng.IOnInit
{
    constructor()
    {
        
    }

    $onInit(): void
    {
    }
}

class blockComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;
    public transclude: boolean = true;

    constructor()
    {
        this.controller = blockComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('block');
        };
    }
}

angular.module(appConstants.appName).component('block', new blockComponent());