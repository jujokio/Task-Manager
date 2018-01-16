

/*References:
    logout.png https://commons.wikimedia.org/wiki/File:Logout.svg
    
*/
angular.module('starter').controller('AppCtrl', function($cordovaNetwork, $cordovaToast, $filter,$ionicScrollDelegate, $ionicLoading, $ionicModal, $ionicPlatform, $ionicPopup, $q, Restangular, $rootScope, $scope, $state, $timeout, $window) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  
    /* OBJECTS */
    $rootScope.isOnline = {}; // offline?
    $rootScope.profileSettings = {}; // store user settings, names...
    $rootScope.activationFlags = {}; // activationFlags. flags flags flags...
    
    /* VARIABLES */
    $rootScope.isOnline.value = true; // internet connection flag controlled from checkConnection()
    $rootScope.profileSettings.Timeout = 30000; // Timeout value in ms

    /* ACTIVATE FLAGS */
    $rootScope.activationFlags.popupOpen = false; // Popup active flag. True when sending any popup is open.
    $rootScope.activationFlags.logoutActive = false; // logOut active flag.
    $rootScope.activationFlags.loading = false; // Loading active flag. true when anything is loading. restricts other from loading.
    $rootScope.activationFlags.isLoggedIn = false; // Log in success flag. True when logged in.
    $rootScope.activationFlags.tabInit = false;

    $rootScope.SidemenuList = [
        {"value":"Login", "enum":0},
        {"value":"Add task", "enum":1},
        {"value":"Manage group", "enum":2},
        {"value":"Statistics", "enum":3},   
    ];
 
    /*
    NO NEED FOR THIS
    $scope.goToSidemenu = function (selectedState){
        console.log(selectedState);
        $rootScope.stateChanged.Flag = true;
        switch (selectedState) {
            case 0:
                $state.go('tab.login', {}, {
                    reload: true
                });
                return;
                
            case 1:
                $state.go('tab.AddTask', {}, {
                    reload: true
                });
                return;

            case 2:
                $state.go('tab.ManageGroup', {}, {
                    reload: true
                });
                return; 

            case 3:
                $state.go('tab.Statistics', {}, {
                    reload: true
                });
                return;

            default:
            return;
        }

    };
    */

        //      Platform ready
            /**
    * @ngdoc method
    * @name ready
    * @methodOf AppCtrl
    * @description
    *  When the device is ready
    * Calls init()
    *  
    */
    $ionicPlatform.ready(function() {
        console.log("Welcome to TaskManager!");
        var baseUrl = "http://ec2-18-196-36-12.eu-central-1.compute.amazonaws.com:5000/gm/s";
        Restangular.setBaseUrl(baseUrl);
        Restangular.setDefaultHeaders({'Content-Type': 'application/json'});
    });


    //      Check internet connection
            /**
    * @ngdoc method
    * @name checkConnection
    * @methodOf AppCtrl
    * @description
    * Check device's internet connection.
    * Toggle $rootScope.isOnline.value true/false.
    *  
    * @returns {boolean} true if connection is available.
    */
    $rootScope.checkConnection = function() {  
        if ($rootScope.platform == Settings.PLATFORM_WEBVIEW){//browser
            //$rootScope.isOnline.value = false;
            //return false;
            return true;
        }
        else if($rootScope.platform == Settings.PLATFORM_ANDROID || $rootScope.platform == Settings.PLATFORM_IOS){// android or ios
            if($cordovaNetwork.isOnline()){
                $rootScope.isOnline.value = true;
                return true;
            }else{//android or ios no connection
                console.log("Internet connection is not ok!");
                $rootScope.isOnline.value = false;
                return false;
            }
        } else {// is windows phone
            if($window.navigator.onLine){
                return true;
            }else{//windows no connection
                console.log("Internet connection is not ok!");
                $rootScope.isOnline.value = false;
                return false;
            }
        }
    };
    


        //      Check server response status (server response)
            /**
    * @ngdoc method
    * @name checkServerResponseStatus
    * @methodOf AppCtrl
    * @description
    * Check server response status and message on error. Displays status and message in dialog.
    * Calls checkConnection()
    * Is deferred
    *  
    * @param {Object} response Server response object
    * @returns {boolean} true if connection is available.
    */
    $rootScope.checkServerResponseStatus = function(response){
        var deferred = $q.defer();
        $rootScope.activationFlags.loading = false;
        var message = $translate.instant('SERVER_MESSAGE');
        if($rootScope.checkConnection()){
            console.log("Network error: ");
            console.error(response);
            //unauthorized?
            if(response.data != null && response.data.Message != null){
                if(response.data.ExceptionType == "System.UnauthorizedAccessException" || response.data.ExceptionMessage == "Attempted to perform an unauthorized operation." || ($rootScope.activationFlags.isLoggedIn && response.data.Message == "An error has occurred." && response.status == 500)){
                    message = $translate.instant('LOG_OUT_WITH_OTHER_DEVICES');
                    $rootScope.hideWait();
                    deferred.reject(false);
                
                }else{    
                    message += response.data.Message;
                }
            //Timeout?
            }else if (response != null && response.config != null && response.config.timeout != null && response.respTime >= response.config.timeout) {
                   message += $translate.instant('ERROR_TIMEOUT');
                   response.TIMEOUT=true;
            //No response at all?
            }else{
                console.log("No message detected");
                deferred.resolve(true);
            }

            // check the status

            if((response == null || response.status == -1 || response.data == null) && !response.TIMEOUT){
                console.log("Response is null");
                message +="<br/>"+"<br/>"+ "Server is not responding. Please check the internet connection.";

            }else if(response.status == 200){
                deferred.resolve(true);

            }else if(response.status == 400){
                message +="<br/>"+"<br/>";

            }else if(response.status == 401){
                message ="<br/>"+"<br/>"+ $translate.instant('WRONG_PASSWORD');
                $rootScope.hideWait();
                deferred.reject(false);

            }else if(response.status == 403){
                message +="<br/>"+"<br/>"+ "This is restricted area. Please leave imediatly";

            }else if(response.status == 404){
                message +="<br/>"+"<br/>"+ "Error 404. Page not found";

            }else if(response.status == 500){
                if(!$rootScope.activationFlags.isLoggedIn && $rootScope.usernameLocked.value>5){
                    message += $translate.instant('USERNAME_LOCKED');
                }
                console.log(" 500 (Internal server error)");
            }else{
                console.log($translate.instant('SERVER_STATUS')+ " " +response.status);
            }

        }else{// checkConnection false
            message = $translate.instant('NETWORK_CONNECTION_FAILED');
        }
        if(!$rootScope.activationFlags.sendOffline){
            $rootScope.hideWait();
            var warn = $ionicPopup.show({
                        template: message,
                        title: $translate.instant('SERVER_ERROR'),
                        subTitle: $translate.instant('SERVER_STATUS')+" "+ response.status,
                        scope: $rootScope,
                        cssClass: 'alert-normal',
                        buttons: [{
                            text: $translate.instant('OK'),
                            type: 'button button-positive',
                            onTap: function() { 
                                    warn.close();
                                    deferred.resolve(message);
                                    
                            }
                        }]
                    });
        }
        else{
            deferred.resolve("Sending offline files");
        }
        return deferred.promise; 
        
    };


    $rootScope.logOut = function(){
        console.log("log out");
        $state.go('Login', {}, {
            reload: true
        });
    };




    //      Hide wait
            /**
    * @ngdoc method
    * @name hideWait
    * @methodOf AppCtrl
    * @description
    * Hide ionic loading spinner
    * disapled if $rootScope.activationFlags.sendoffline == true.
    *  
    */
    $rootScope.hideWait = function() {
        if(!$rootScope.activationFlags.sendOffline){
            $ionicLoading.hide();
            $rootScope.activationFlags.loading = false;
        }
        
    };














        //      Show Deferred alert (title, details)
            /**
    * @ngdoc method
    * @name showDeferredAlert
    * @methodOf AppCtrl
    * @description
    * Show pop up with given title and text.
    * Is deferred, No reject
    *  
    * @param {string} title title.
    * @param {string} text text
    */
    $rootScope.showDeferredAlert = function(title, text) {
        var deferred = $q.defer();
        if(!$rootScope.activationFlags.popupOpen){
            $rootScope.activationFlags.popupOpen = true;
            var popup =  $ionicPopup.show({
                            template: text,
                            title: title,
                            subTitle: "",
                            scope: $rootScope,
                            cssClass: 'alert-normal',
                            buttons: [{
                                            text: "OK",
                                            type: 'button button-positive',
                                            onTap: function() { 
                                                    popup.close();
                                                    $rootScope.activationFlags.popupOpen = false;
                                                    deferred.resolve(true);
                                                    
                                            }
                                    }]
                        });
        }else{
            console.log("already open!");
            deferred.resolve(true);
        }
        
        return deferred.promise;
    };



        //      Show Deferred Popup (title, details)
            /**
    * @ngdoc method
    * @name showDeferredPopup
    * @methodOf AppCtrl
    * @description
    * Show popup with given title and text.
    * Is deferred, No reject
    *  
    * @param {string} title title.
    * @param {string} text text
    * @returns {boolean} Yes/No -> true/false
    */
    $rootScope.showDeferredPopup = function(title, text) {
        var deferred = $q.defer();
        if(!$rootScope.activationFlags.popupOpen){
            $rootScope.activationFlags.popupOpen=true;
            var popup =  $ionicPopup.show({
                        template: text,
                        title: title,
                        subTitle: "",
                        scope: $rootScope,
                        cssClass: 'alert-normal',
                        buttons: [{
                                    text: "No",
                                    type: 'button button-negative',
                                    onTap: function() {
                                        popup.close();
                                        $rootScope.activationFlags.popupOpen =false;
                                        deferred.resolve(false);

                                        }
                                    },{
                                        text: "Yes",
                                        type: 'button button-positive',
                                        onTap: function() { 
                                                popup.close();
                                                $rootScope.activationFlags.popupOpen= false;
                                                deferred.resolve(true);
                                                
                                        }
                                }]
                    });
                }else{
                    console.log("$rootScope.activationFlags.popupOpen: "+$rootScope.activationFlags.popupOpen);
                    deferred.resolve($rootScope.activationFlags.popupOpen);
                }
    
        return deferred.promise;
    };

        //      Show wait
            /**
    * @ngdoc method
    * @name showWait
    * @methodOf AppCtrl
    * @description
    * Show ionic loading spinner with message. appears after delay (250ms)
    * Disabled if $rootScope.activationFlags.sendOffline == true
    * 
    * @param {string} text show this text
    */
    $rootScope.showWait = function(text) {
        var loading = text;
        if ($rootScope.platform != "Windows") {
            loading = text +
                "<br /><br /><ion-spinner></ion-spinner>";
        }
        $ionicLoading.show({
            noBackdrop: true,
            template: loading,
            delay: Settings.LOADING_SPINNER_DELAY
        });
    };
  });
  