



angular.module('starter').controller('LoginCtrl', function($scope, $rootScope, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  
        
        $scope.loginInfo= {};
   
             

        $scope.doLogin = function (){
            console.log("login");
            var time = new Date().getTime();
            
            $rootScope.cookie = Cookies.set('TaskManagerCookie', time, { expires: 2 });
            
            var loginJSON = {
                "email":$scope.loginInfo.email,
                "password":$scope.loginInfo.password,
                "mac_address": $rootScope.cookie
            }
            
            Restangular.all("login").withHttpConfig().post(loginJSON).then(function(data) {
                $scope.loginInfo= {};
                console.log("login with:");
                console.log(loginJSON.email);
                $state.go('tab.AddTask', {}, {
                    reload: true
                });
                
            

            });
        };





        $scope.goToNewUser = function (){
            console.log("go to new user");
            $state.go('NewUser', {}, {
                reload: true
            });
            $scope.loginInfo= {};
        };
  
  });
  