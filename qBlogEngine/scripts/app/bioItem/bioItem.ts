import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

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
    public template: string;
    public transclude: boolean = true;
    public bindings: any;

    constructor()
    {
        this.controller = bioItemComponentController;
        this.template = require('./bioItem.html');
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