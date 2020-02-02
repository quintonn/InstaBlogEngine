import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

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
    public template: string;
    public transclude: boolean = true;

    constructor()
    {
        this.controller = subHeadingComponentController;
        this.template = require('./subHeading.html');
    }
}

angular.module(appConstants.appName).component('subHeading', new subHeadingComponent());