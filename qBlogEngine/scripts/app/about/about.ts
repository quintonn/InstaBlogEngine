import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

require("../../appConfig");

class aboutComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    constructor(public $scope: ng.IScope)
    {
        
    }

    $onInit(): void
    {
        
    }

    
}

class aboutComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;

    constructor()
    {
        this.controller = aboutComponentController;
        this.template = require('./about.html');
    }
}

angular.module(appConstants.appName).component('about', new aboutComponent());