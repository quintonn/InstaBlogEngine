import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

require("../../appConfig");

class listComponentController implements ng.IOnInit
{
    static $inject = ['$scope', '$transclude'];

    public minWidth: string;
    public count: number = 1;
    public type: string;

    constructor()
    {
        
    }

    $onInit(): void
    {
        if (this.type == 'number' && (this.minWidth == null || this.minWidth == ''))
        {
            this.minWidth = '20px';
        }
    }

    
}

class listComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;
    public bindings: any;
    public transclude: boolean = true;

    constructor()
    {
        this.controller = listComponentController;
        this.template = require('./list.html');
        this.bindings =
        {
            minWidth: "@",
            type: "@"
        };
    }
}

angular.module(appConstants.appName).component('list', new listComponent());