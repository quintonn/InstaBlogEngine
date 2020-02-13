import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { configService } from '../../services/configService';

require("../../appConfig");

class listItemComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    parent: any;
    minWidth: string;
    number: number;
    heading: string;
    hasNumbers: boolean = false;

    constructor(public $scope: ng.IScope)
    {
        
    }

    public getClasses(): string
    {
        if (this.hasNumbers == true)
        {
            return 'flex-row md:flex-row';
        }
        else
        {
            return 'mb-1 flex-col md:flex-row';
        }
        return '';
    }

    $onInit(): void
    {
        this.minWidth = this.parent.minWidth;
        let self = this;

        if (this.parent.type == 'number')
        {
            this.number = this.parent.count++;
            this.hasNumbers = true;
            this.heading = self.number + ".";
        }
    }

    
}

class listItemComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;
    public transclude: boolean = true;
    public bindings: any;
    public require: any;

    constructor()
    {
        this.controller = listItemComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('listItem');
        }
        this.bindings =
        {
            heading: "@",
        };
        this.require =
        {
            parent: '^list'
        };
    }
}

angular.module(appConstants.appName).component('listItem', new listItemComponent());