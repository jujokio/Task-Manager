



angular.module('starter').controller('NewUserCtrl', function($q, $scope, $rootScope, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  
        
        $scope.userInfo = {};   
             

        $scope.doRegister = function (){
            var registerJSON = {
                "student_name":$scope.userInfo.studentName,
                "email":$scope.userInfo.email,
                "student_number":$scope.userInfo.studentNumber,
                "password":$scope.userInfo.password,
                "phone_number":$scope.userInfo.studentName
            }
            /*
            var baseUrl = "http://ec2-52-58-73-142.eu-central-1.compute.amazonaws.com:5000/";
            Restangular.all("login").withHttpConfig().post(registerJSON).then(function(data) {
                */
                $scope.userInfo = {};
                console.log("register with:");
                console.log(registerJSON);
                $scope.userInfo= {};
                $state.go('tab.AddTask', {}, {
                    reload: true
                });
        };




        
        $scope.goToLogin = function (){
            $scope.userInfo= {};
            $state.go('Login', {}, {
                reload: true
            });
           
        };
  
  });
  