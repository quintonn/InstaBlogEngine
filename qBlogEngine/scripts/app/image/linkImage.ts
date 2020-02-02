import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

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
    public template: string;
    public bindings: any;

    constructor()
    {
        this.controller = linkImageComponentController;
        this.template = require('./linkImage.html');
        this.bindings =
        {
            src: "@"
        };
    }
}

angular.module(appConstants.appName).component('linkImage', new linkImageComponent());