



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
            console.log("login with:");
            console.log($scope.loginInfo);
            $state.go('tab.AddTask', {}, {
                reload: true
            });
            $scope.loginInfo= {};
      };
  
  });
  