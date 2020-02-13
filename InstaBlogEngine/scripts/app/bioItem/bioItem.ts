import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { configService } from '../../services/configService';

require("../../appConfig");

class bioItemComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    align: string = "left";

    constructor(public $scope: ng.IScope)
    {
        
    }

    $onInit(): void
    {
        
    }

    
}

class bioItemComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;
    public transclude: boolean = true;
    public bindings: any;

    constructor()
    {
        this.controller = bioItemComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('bioItem');
        };
        this.bindings =
        {
            url: "@",
            imageSource: "@",
            imageCaption: "@",
            heading: "@",
            align: "@"
        };
    }
}

angular.module(appConstants.appName).component('bioItem', new bioItemComponent());