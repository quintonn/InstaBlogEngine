import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

require("../../appConfig");

class sectionComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    constructor(public $scope: ng.IScope)
    {
        
    }

    $onInit(): void
    {
       
    }

    
}

class sectionComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;
    public transclude: boolean = true;
    public bindings: any;

    constructor()
    {
        this.controller = sectionComponentController;
        this.template = require('./section.html');
        this.bindings =
        {
            heading: "@"
        };
    }
}

angular.module(appConstants.appName).component('section', new sectionComponent());