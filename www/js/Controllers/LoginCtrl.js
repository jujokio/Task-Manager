



angular.module('starter').controller('LoginCtrl', function($scope, $rootScope, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  
        
        $scope.loginInfo= {};
        $scope.loginInfo.password="d";
        $scope.loginInfo.email="d";   
             

        $scope.doLogin = function (){
            console.log("login");
            
            var loginJSON = {
                "student_name":$scope.loginInfo.studentName,
                "email":$scope.loginInfo.email,
                "password":$scope.loginInfo.password,
                "mac_address":$scope.loginInfo.mac
            }
            /*
            var baseUrl = "http://ec2-52-58-73-142.eu-central-1.compute.amazonaws.com:5000/";
            Restangular.setBaseUrl(baseUrl);
            Restangular.setDefaultHeaders({'Content-Type': 'application/json'});
            Restangular.all("login").withHttpConfig().post(loginJSON).then(function(data) {
                Restangular.setDefaultHeaders({'Authorization': 'Bearer ' +  data});
                */
                $scope.loginInfo= {};
                console.log("login with:");
                console.log(loginJSON);
                $state.go('tab.AddTask', {}, {
                    reload: true
                });
                
            

            //});
        };





        $scope.goToNewUser = function (){
            console.log("go to new user");
            $state.go('NewUser', {}, {
                reload: true
            });
            $scope.loginInfo= {};
        };
  
  });
  