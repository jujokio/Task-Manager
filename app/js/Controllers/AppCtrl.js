

/*References:
    logout.png https://commons.wikimedia.org/wiki/File:Logout.svg
    
*/
angular.module('starter').controller('AppCtrl', function($filter, $ionicScrollDelegate, $ionicLoading, $ionicModal, $ionicPlatform, $ionicPopup, $q, Restangular, $rootScope, $scope, $state, $timeout, $window) {
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
    $scope.loginInfo= {};
    $scope.userInfo = {};
    
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
            $rootScope.goToState('Login');

                return;
                
            case 1:
            $rootScope.goToState('tab.AddTask');

                return;

            case 2:
                $rootScope.goToState('tab.ManageGroup');
                return; 

            case 3:
                $rootScope.goToState('tab.Statistics');
                
                return;

            default:
            return;
        }

    };
    */

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
        var baseUrl = "http://ec2-18-196-36-12.eu-central-1.compute.amazonaws.com:5000/gm/";
        Restangular.setBaseUrl(baseUrl);
        Restangular.setDefaultHeaders({'Content-Type': 'application/json'});

    });

    /**
    * @ngdoc method
    * @name askAPI
    * @methodOf AppCtrl
    * @description
    * Send API requests
    * Calls checkServerResponseStatus() if error
    * Is deferred
    *  
    * @param {String} command API request method
    * @param {String} apiUrl Url for request
    * @param {Object} payloadJSON JSON for request
    * @returns {Object} server response
    */
    $rootScope.askAPI = function(command,apiUrl, payloadJSON) {
        var deferred = $q.defer();

        console.log("command: "+ command);
        console.log("apiUrl: "+ apiUrl);
        console.log("payload: "+ JSON.stringify(payloadJSON));
        
        if(command == Settings.Post){
            var startTime = new Date().getTime();
            Restangular.all(apiUrl).post(payloadJSON).then(function(response) {
                deferred.resolve(response);

                },function(err){//Rest Post
                    err.respTime = new Date().getTime() - startTime;
                    $rootScope.checkServerResponseStatus(err).then(function(){
                        deferred.resolve(null);
                    },function(err){   
                        $rootScope.doLogOut();
                }); // rest Post
            });
        }else if(command == Settings.Get){
            var startTime = new Date().getTime();
            Restangular.one(apiUrl).get(payloadJSON).then(function(response) {
                deferred.resolve(response);

                },function(err){//Rest Get
                    err.respTime = new Date().getTime() - startTime;
                    $rootScope.checkServerResponseStatus(err).then(function(){
                        deferred.resolve(null);
                    },function(err){
                        $rootScope.doLogOut();
                }); // rest Get
            }); 
        }else{
            console.log("command: "+ command);
            console.log("apiUrl: "+ apiUrl);
            console.log("payload: "+ JSON.stringify(payloadJSON));
            deferred.resolve(null);
        }
        


        return deferred.promise;
    };

    


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
        $rootScope.activationFlags.popupOpen = true;
        var message = "Server Messsage: ";

        console.log("Network error: ");
        console.error(response);
        //unauthorized?
        if(response.data != null && response.data.Message != null){
            if(response.data.ExceptionType == "System.UnauthorizedAccessException" || response.data.ExceptionMessage == "Attempted to perform an unauthorized operation." || ($rootScope.activationFlags.isLoggedIn && response.data.Message == "An error has occurred." && response.status == 500)){
                message = "Log out with other devices please."
                $rootScope.hideWait();
                deferred.reject(false);
            
            }else{    
                message += response.data.Message;
            }
        //Timeout?
        }else if (response != null && response.config != null && response.config.timeout != null && response.respTime >= response.config.timeout) {
                message += "Connection timed out";
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
            message ="<br/>"+"<br/>"+ "Wrong password, please try again.";
            $rootScope.hideWait();
            deferred.reject(false);

        }else if(response.status == 403){
            message +="<br/>"+"<br/>"+ "This is restricted area. Please leave imediatly";

        }else if(response.status == 404){
            message +="<br/>"+"<br/>"+ "Error 404. Page not found";

        }else if(response.status == 500){
            if(!$rootScope.activationFlags.isLoggedIn && $rootScope.usernameLocked.value>5){
                message += "Username is locked! Please contact your friendly neighborhood Admin.";
            }
            console.log(" 500 (Internal server error)");
        }else{
            console.log("Server status:" + response.status);
        }

        
        if(!$rootScope.activationFlags.sendOffline){
            $rootScope.hideWait();
            var warn = $ionicPopup.show({
                        template: message,
                        title: "Server error",
                        subTitle: "Server status: " + response.status,
                        scope: $rootScope,
                        cssClass: 'alert-normal',
                        buttons: [{
                            text: 'OK',
                            type: 'button button-positive',
                            onTap: function() { 
                                    warn.close();
                                    $rootScope.activationFlags.popupOpen = false;
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


      
    /**
    * @ngdoc method
    * @name doLogin
    * @methodOf AppCtrl
    * @description
    * do log in
    * Calls askAPI(), goToState()
    *  
    */
    $rootScope.doLogin = function (){
        if(!$rootScope.activationFlags.loading && !$rootScope.activationFlags.popupOpen){
            $rootScope.showWait('Logging in...');
            $rootScope.activationFlags.loading = true;
            console.log("login");
            var time = new Date().getTime();
            
            $rootScope.cookie = Cookies.set('TaskManagerCookie', time, { expires: 2 });
            console.log("cookie");
            var loginJSON = {
                "email":$scope.loginInfo.email,
                "password":$scope.loginInfo.password,
                "mac_address": $rootScope.cookie
            }
            console.log("ask");
            $rootScope.askAPI(Settings.Post, "login", loginJSON).then(function(response){
                if(response != null){
                    $rootScope.loggedUser = angular.copy($scope.loginInfo);
                    $rootScope.activationFlags.isLoggedIn = true;
                    $scope.loginInfo= {};
                    console.log("login with:");
                    console.log(loginJSON.email);
                    $rootScope.activationFlags.loading = false;
                    $rootScope.hideWait();
                    $rootScope.goToState('tab.AddTask');
                }else{
                    $rootScope.activationFlags.loading = false;
                    $rootScope.hideWait();
                }
            });
        }else{
            console.log("I'm busy as a bee!");
        }
    };



    /**
    * @ngdoc method
    * @name doLogOut
    * @methodOf AppCtrl
    * @description
    * Do log out
    * calls askAPI() goToState()
    * Is deferred
    *  
    */
    $rootScope.doLogOut = function(){
        if(!$rootScope.activationFlags.loading && !$rootScope.activationFlags.popupOpen){
            $rootScope.showWait('Logging out...');
            var logOutJSON = {
                "email":$rootScope.loggedUser.email,
                "mac_address": $rootScope.cookie
            }
            $rootScope.askAPI(Settings.Post, "logout", logOutJSON).then(function(response){
                $rootScope.hideWait();
                $rootScope.activationFlags.loading = false;
                $rootScope.goToState('Login');
            });
        }else{
            console.log("I'm busy as a bee!");
        }
    };



    /**
    * @ngdoc method
    * @name doRegister
    * @methodOf AppCtrl
    * @description
    * Register new user
    * Calls askAPI()
    *  
    */
    $rootScope.doRegister = function (){
        if(!$rootScope.activationFlags.loading && !$rootScope.activationFlags.popupOpen){
            $rootScope.showWait('Registering...');
            $rootScope.activationFlags.loading = true;
            var registerJSON = {
                "student_name":$scope.userInfo.studentName,
                "email":$scope.userInfo.email,
                "student_number":[$scope.userInfo.studentNumber],
                "password":$scope.userInfo.password,
                "phone_number":[$scope.userInfo.phoneNumber]
            }
            $rootScope.askAPI(Settings.Post, "create_user", registerJSON).then(function(response){
                console.log("register with:");
                console.log(registerJSON);
                $scope.userInfo= {};
                $rootScope.hideWait();
                $rootScope.activationFlags.loading = false;
                $rootScope.goToState('Login');
            });
        }else{
            console.log("I'm busy as a bee!");
        }
    };



    /**
    * @ngdoc method
    * @name goToState
    * @methodOf AppCtrl
    * @description
    * Change state
    *  
    * @param {String} stateName State name as described in app.js
    */
    $rootScope.goToState = function (stateName){
        console.log("go to: " + stateName);
        $state.go(stateName, {}, {
            reload: true
        });
    };



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



    /**
    * @ngdoc method
    * @name validateRegister
    * @methodOf AppCtrl
    * @description
    * is the registration JSON valid
    * 
    * @returns {boolean} true/false
    */
    $rootScope.validateRegister = function() {
       var valid = false;
       if($scope.userInfo){
            if($scope.userInfo.email != null && $scope.userInfo.studentName != null && $scope.userInfo.studentNumber != null){
                if($scope.userInfo.password != null && $scope.userInfo.confirmPassword != null){
                    if($scope.userInfo.password.toString().length>=5 && $scope.userInfo.password != "" && $scope.userInfo.password.toString() == $scope.userInfo.confirmPassword.toString()){
                        valid = true;
                    }
                }
            }
       }
       return valid;
    };

  });
  