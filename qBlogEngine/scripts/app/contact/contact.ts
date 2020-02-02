import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

require("../../appConfig");

class contactComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    constructor(public $scope: ng.IScope)
    {
        
    }

    $onInit(): void
    {
        
    }

    
}

class contactComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;

    constructor()
    {
        this.controller = contactComponentController;
        this.template = require('./contact.html');
    }
}

angular.module(appConstants.appName).component('contact', new contactComponent());