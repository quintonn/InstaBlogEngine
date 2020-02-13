import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { configService } from '../../services/configService';

require("../../appConfig");

class subHeadingComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    constructor(public $scope: ng.IScope)
    {
        
    }

    $onInit(): void
    {
        
    }

    
}

class subHeadingComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;
    public transclude: boolean = true;

    constructor()
    {
        this.controller = subHeadingComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('subHeading');
        }
    }
}

angular.module(appConstants.appName).component('subHeading', new subHeadingComponent());