    // Ionic Starter App

    // angular.module is a global place for creating, registering and retrieving Angular modules
    // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
    // the 2nd parameter is an array of 'requires'
    // 'starter.services' is found in services.js
    // 'starter.controllers' is found in controllers.js
    angular.module('starter', ['ionic','ngCordova', 'restangular'])

    .run(function($cordovaDevice, $ionicHistory, $ionicLoading, $ionicPlatform, $ionicPopup, $rootScope, $state) {

        $rootScope.$on('$stateChangeStart', function() {
            $ionicLoading.hide();
        });

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
            }
        });

        if ($rootScope.isWindowsPhone) {
            $rootScope.platform = Settings.PLATFORM_WINDOWS;

            WinJS.Application.onbackclick = function (evt) {
                $ionicPlatform.hardwareBackButtonClick(evt);
                return true;
            };
        }else if (ionic.Platform.is('browser') ) {
            $rootScope.platform = Settings.PLATFORM_BROWSER;
        } else if (ionic.Platform.isAndroid()) {
            $rootScope.platform = Settings.PLATFORM_ANDROID;
        } else if (ionic.Platform.isIPad() || ionic.Platform.isIOS()) {
            $rootScope.platform = Settings.PLATFORM_IOS;
        } else if (ionic.Platform.isWebView() || ionic.Platform.platforms == null) {
            $rootScope.platform = Settings.PLATFORM_WEBVIEW;
        } 


        document.addEventListener("deviceready", function() {
            if (ionic.Platform.is('browser') ) {
                $rootScope.deviceModel = "Browser";
                $rootScope.currentPlatform = "Browser";
                $rootScope.currentPlatformVersion = "Browser";
                $rootScope.manufacturer = "Browser";
            }else{
                $rootScope.deviceModel = $cordovaDevice.getModel();
                $rootScope.currentPlatform = $cordovaDevice.getPlatform();
                $rootScope.currentPlatformVersion = $cordovaDevice.getVersion();
                $rootScope.manufacturer = $cordovaDevice.getManufacturer();
            }

            console.log("currentPlatform: " + $rootScope.currentPlatform);
            console.log("currentPlatformVersion: " + $rootScope.currentPlatformVersion);
            console.log("Device model: " + $rootScope.deviceModel);
            console.log("Device manufacturer: " + $rootScope.manufacturer);

            $rootScope.deviceVersion = '';
            if ($rootScope.manufacturer != null) {
                if ($rootScope.deviceVersion != '') {
                    $rootScope.deviceVersion = $rootScope.deviceVersion + '|';
                }

                $rootScope.deviceVersion = $rootScope.deviceVersion + $rootScope.manufacturer;
            }

            if ($rootScope.deviceModel != null) {
                if ($rootScope.deviceVersion != '') {
                    $rootScope.deviceVersion = $rootScope.deviceVersion + '|';
                }

                $rootScope.deviceVersion = $rootScope.deviceVersion + $rootScope.deviceModel;
            }

            if ($rootScope.currentPlatformVersion != null) {
                if ($rootScope.deviceVersion != '') {
                    $rootScope.deviceVersion = $rootScope.deviceVersion + '|';
                }

                $rootScope.deviceVersion = $rootScope.deviceVersion + $rootScope.currentPlatformVersion;
            }

            if ($rootScope.appVersion != null) {
                if ($rootScope.deviceVersion != '') {
                    $rootScope.deviceVersion = $rootScope.deviceVersion + '|';
                }

                $rootScope.deviceVersion = $rootScope.deviceVersion + $rootScope.appVersion;
            }
            
        });      

    })//run

    .config(function($ionicConfigProvider, $qProvider, RestangularProvider, $stateProvider, $urlRouterProvider) {

        //$qProvider.errorOnUnhandledRejections(false);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        .state('Login', {
            url: '/Login',
            templateUrl: 'templates/Login.html',
            controller: 'LoginCtrl'
        })



        // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'AppCtrl'
        })

        // Each tab has its own nav history stack:



        .state('tab.AddTask', {
        url: '/AddTask',
        views: {
            'AddTask': {
            templateUrl: 'templates/AddTask.html',
            controller: 'AddTaskCtrl'
            }
        }
        })
        .state('tab.ManageGroup', {
        url: '/ManageGroup',
        views: {
            'ManageGroup': {
            templateUrl: 'templates/ManageGroup.html',
            controller: 'ManageGroupCtrl'
            }
        }
        })
        .state('tab.Statistics', {
        url: '/Statistics',
        views: {
            'Statistics': {
            templateUrl: 'templates/Statistics.html',
            controller: 'StatisticsCtrl'
            }
        }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('Login');

    });
