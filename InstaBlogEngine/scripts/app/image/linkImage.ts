import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { configService } from '../../services/configService';

require("../../appConfig");

class linkImageComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    src: string;

    constructor(public $scope: ng.IScope)
    {
    }

    $onInit(): void
    {
        
    }
}

class linkImageComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;
    public bindings: any;

    constructor()
    {
        this.controller = linkImageComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('linkImage');
        };
        this.bindings =
        {
            src: "@",
            imageSource: "@",
            imageCaption: "@"
        };
    }
}

angular.module(appConstants.appName).component('linkImage', new linkImageComponent());