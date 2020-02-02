import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

require("../../appConfig");

class webLinkComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    constructor(public $scope: ng.IScope)
    {
        
    }

    $onInit(): void
    {
    }

    
}

class webLinkComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;
    public transclude: boolean = true;
    public bindings: any;

    constructor()
    {
        this.controller = webLinkComponentController;
        this.template = require('./webLink.html');
        this.bindings =
        {
            link: "@",
        };
    }
}

angular.module(appConstants.appName).component('webLink', new webLinkComponent());