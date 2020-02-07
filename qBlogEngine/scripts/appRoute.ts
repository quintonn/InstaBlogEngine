import * as angular from 'angular';
import { appConstants } from './models/appConstants';
import { ILocationProvider, ISCEDelegateProvider } from 'angular';
import { menuService } from './services/menuService';

require("./appConfig");

angular.module(appConstants.appName).config(['$routeProvider', '$sceDelegateProvider', '$locationProvider', function ($routeProvider: ng.route.IRouteProvider, $sceDelegateProvider: ISCEDelegateProvider, $locationProvider: ILocationProvider)
{
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        '**']);

    $routeProvider.when("/x/:path?",
        {
            template: function ($routeParams: ng.route.IRouteParamsService)
            {
                var item = $routeParams.path;
                if (item == null || item.length == 0)
                {
                    item = "home";
                }
                //return "<" + item + "></" + item + ">";
                return "<menu-item path='" + item + "'></menu-item>";
            },
            resolve:
            {
                xx: ['$location', 'menuService', function ($location: ng.ILocationService, menuService: menuService)
                {
                    var parts = $location.path().split('/');
                    var path = parts[parts.length - 1];
                    menuService.setHeading(path);
                }]
            }
        }).when("/:path?",
        {
            template: function ($routeParams: ng.route.IRouteParamsService)
            {
                var item = $routeParams.path;
                if (item == null || item.length == 0)
                {
                    item = "home";
                }
                
                return "<" + item + "></" + item + ">";
            },
            resolve:
            {
                xx: ['$location', 'menuService', function ($location: ng.ILocationService, menuService : menuService)
                {
                    var path = $location.path().substr(1);
                    menuService.setHeading(path);
                }]
            }
        }).when("/:path/:category/:name",
            {
                template: function ($routeParams: ng.route.IRouteParamsService)
                {
                    let item = $routeParams.path;
                    let name = $routeParams.name;
                    //let title = $routeParams.title.replace(/_/g, ' ');
                    let category = $routeParams.category;
                    
                    if (item == null || item.length == 0)
                    {
                        item = "home";
                    }

                    return "<" + item + " category='" + category + "' name='" + name + "'></" + item + ">";
                }
            });
    //$locationProvider.html5Mode({ enabled: true, requireBase: false });
    // using this breaks refresh - refreshing requires url rewrites.
}]);