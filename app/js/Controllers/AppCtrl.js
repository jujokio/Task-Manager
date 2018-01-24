

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
        if(!$rootScope.activationFlags){
            console.log("RESET!");
            $rootScope.isOnline = {}; // offline?
            $rootScope.profileSettings = {}; // store user settings, names...
            $rootScope.activationFlags = {}; // activationFlags. flags flags flags...
            $rootScope.userInfo = {}; // store create_user request json.
            $rootScope.groupInfo = {}; // store create_group request json.
            $rootScope.allGroups = {}; // store fetch_group request's respone.
            $rootScope.expand = {}; // expandable content
            
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
            console.log("Welcome to TaskManager!");
            var baseUrl = "http://ec2-18-196-36-12.eu-central-1.compute.amazonaws.com:5000/gm/";
            Restangular.setBaseUrl(baseUrl);
            Restangular.setDefaultHeaders({'Content-Type': 'application/json'});
        }
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
        if(response.data != null && response.data.message != null){
            if(response.data.ExceptionType == "System.UnauthorizedAccessException" || response.data.ExceptionMessage == "Attempted to perform an unauthorized operation." || ($rootScope.activationFlags.isLoggedIn && response.data.message == "An error has occurred." && response.status == 500)){
                message = "Log out with other devices please."
                $rootScope.hideWait();
                deferred.reject(false);
            
            }else{    
                message += response.data.message;
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
    * @name doCreateGroup
    * @methodOf AppCtrl
    * @description
    * Join in one group
    * Calls askAPI(), goToState()
    *  
    */
    $rootScope.doCreateGroup = function (){
        if(!$rootScope.activationFlags.loading && !$rootScope.activationFlags.popupOpen){
            $rootScope.showWait('Creating your new group...');
            $rootScope.activationFlags.loading = true;
            var createJSON = {
                "email":$rootScope.profileSettings.email,
                "group_name": $rootScope.groupInfo.group_name,
                "group_describtion": $rootScope.groupInfo.group_description
            };
            $rootScope.askAPI(Settings.Post, "create_group", createJSON).then(function(response){
                if(response != null){
                    $rootScope.activationFlags.loading = false;
                    $rootScope.groupInfo = {};
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
    * @name doJoinGroup
    * @methodOf AppCtrl
    * @description
    * Join in one group
    * Calls askAPI(), goToState()
    *  
    * @param {String} groupID ID of the group in question
    */
    $rootScope.doJoinGroup = function (group){
        if(!$rootScope.activationFlags.loading && !$rootScope.activationFlags.popupOpen){
            $scope.selectedGroup = group;
            $rootScope.showDeferredPopup("Confirm", "Do you want to join "+ $scope.selectedGroup.name+"?").then(function(res){
                if(res){//confirm yes
                    $rootScope.showWait('Joining...');
                    $rootScope.activationFlags.loading = true;
                    var joinJSON = {
                        "email":$rootScope.profileSettings.email,
                        "group_id":$scope.selectedGroup.group_id                
                    };
                    $rootScope.askAPI(Settings.Post, "join_group", joinJSON).then(function(response){
                        if(response != null){
                            $rootScope.goToState('tab.AddTask');
                            $rootScope.activationFlags.loading = false;
                            $rootScope.hideWait();
                        
                        }else{
                            $rootScope.activationFlags.loading = false;
                            $rootScope.hideWait();
                        }
                    });
                }else{//confirm no
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
    * @name doLogin
    * @methodOf AppCtrl
    * @description
    * do log in
    * Calls askAPI(), goToState()
    * If group Id is null, next state is 'joinGroup'.
    *  
    */
    $rootScope.doLogin = function (){
        if(!$rootScope.activationFlags.loading && !$rootScope.activationFlags.popupOpen){
            $rootScope.showWait('Logging in...');
            $rootScope.activationFlags.loading = true;
            var time = new Date().getTime();
            var cookie = Cookies.set('TaskManagerCookie', time, { expires: 2 });
            var loginJSON = {
                "email":$rootScope.profileSettings.email,
                "password":$rootScope.profileSettings.password,
                "mac_address": cookie
            }
            console.log("login json:");
            console.log(loginJSON);
            $rootScope.askAPI(Settings.Post, "login", loginJSON).then(function(response){
                if(response != null){
                    $rootScope.profileSettings.password = null;
                    $rootScope.profileSettings = response;
                    $rootScope.profileSettings.cookie = cookie;
                    $rootScope.activationFlags.isLoggedIn = true;
                    $rootScope.activationFlags.loading = false;
                    $rootScope.hideWait();
                    $rootScope.greetings().then(function(){
                        if(response.group_id == null){
                            $rootScope.initJoinGroup();
                            $rootScope.goToState("joinGroup");
                        }else{
                            $rootScope.goToState('tab.AddTask');
                        }
                    });
                }else{
                    $rootScope.profileSettings.password = null;
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
            console.log("profile settings:");
            console.log($rootScope.profileSettings);
            var logOutJSON = {
                "email":$rootScope.profileSettings.email,
                "mac_address": $rootScope.profileSettings.cookie
            }
            console.log("log out json:");
            console.log(logOutJSON);
            $rootScope.askAPI(Settings.Post, "logout", logOutJSON).then(function(response){
                $rootScope.activationFlags.isLoggedIn = false;
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
                "student_name":$rootScope.userInfo.studentName,
                "email":$rootScope.userInfo.email,
                "student_number":[$rootScope.userInfo.studentNumber],
                "password":$rootScope.userInfo.password,
                "phone_number":[$rootScope.userInfo.phoneNumber]
            }
            $rootScope.askAPI(Settings.Post, "create_user", registerJSON).then(function(response){
                console.log("register with:");
                console.log(registerJSON);
                $rootScope.userInfo= {};
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
    * @name greetings
    * @methodOf AppCtrl
    * @description
    * Show greetings dialog for user with user name displayed.
    * Message changes overtime.
    * Is deferred, No reject
    *  
    */
    $rootScope.greetings = function(){
        $rootScope.hideWait();
        var deferred = $q.defer();
        var greet = "Hello";
        var h = new Date().getHours();
        if(h <= 5){
            greet = "You really should sleep at some point you know.";
        }else if(h > 5 && h <= 7){
            greet = "Good morning, or is it still night?";
        }else if(h > 7 && h < 12){
            greet = "Good morning! Have a nice day";
        }else if(h == 12){
            greet = "What  pleasant day, don't forget to take a breaks.";
        }else if(h > 12 && h < 16){
            greet = "Good afternoon.";
        }else if(h >= 16 && h < 20  ){
            greet = "Oh dear, still working?";
        }else if(h >= 20){
            greet = "Have a nice evening.";
        }

        if(new Date().getDay()==5){
            greet += "<br/><br/>"+ "Have a great weekend!";
        }

        var succ = $ionicPopup.show({
            template: greet,
            title: "Greetings " + $rootScope.profileSettings.name,
            subTitle: "",
            scope: $rootScope,
            cssClass: 'alert-normal',
            buttons: [{
                text: "Ok",
                type: 'button button-positive',
                onTap: function() { 
                        succ.close();
                        deferred.resolve(true);
                }
            }]
        });
        return deferred.promise; 
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
    * @name initJoinGroup
    * @methodOf AppCtrl
    * @description
    * Show pop up with given title and text.
    */
    $rootScope.initJoinGroup = function() {
        if(!$rootScope.expand){
            $rootScope.expand= {};
        }
        $scope.selectedGroup = {};
        $rootScope.expand.join = false;
        $rootScope.expand.create = false;
        $rootScope.askAPI(Settings.Get, "fetch_groups", ).then(function(response){
            if(response != null){
                $rootScope.allGroups = response;
            }
        });
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
    * @name updateSelectedGroup
    * @methodOf AppCtrl
    * @description
    * assign selected group, and update the variable
    *
    * @param {Object} group Group-object to assign
    */
    $rootScope.updateSelectedGroup = function(group) {
        $scope.selectedGroup = group;
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
       if($rootScope.userInfo){
            if($rootScope.userInfo.email != null && $rootScope.userInfo.studentName != null && $rootScope.userInfo.studentNumber != null){
                if($rootScope.userInfo.password != null && $rootScope.userInfo.confirmPassword != null){
                    if($rootScope.userInfo.password.toString().length>=5 && $rootScope.userInfo.password != "" && $rootScope.userInfo.password.toString() == $rootScope.userInfo.confirmPassword.toString()){
                        valid = true;
                    }
                }
            }
       }
       return valid;
    };

  });
  