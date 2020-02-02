import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

require("../../appConfig");

class blockComponentController implements ng.IOnInit
{
    constructor()
    {
        
    }

    $onInit(): void
    {
    }
}

class blockComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;
    public transclude: boolean = true;

    constructor()
    {
        this.controller = blockComponentController;
        this.template = require('./block.html');
    }
}

angular.module(appConstants.appName).component('block', new blockComponent());