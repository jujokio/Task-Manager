



angular.module('starter').controller('ManageGroupCtrl', function($scope, $rootScope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
  

    $scope.groupMembers = [
        {
            "Name":"member1",
            "Email":"email@student.oulu.fi",
            "Number":"04012312312",
            "Other":"More data"
        },
        {
            "Name":"member2",
            "Email":"email2@student.oulu.fi",
            "Number":"04012312312",
            "Other":"More data"
        },
        {
            "Name":"member3",
            "Email":"email3@student.oulu.fi",
            "Number":"04012312312",
            "Other":"More data"
        }
    ];

    $scope.showGroupMemberData = function(member){
        var text = "Email: "+ member.Email + "<br/>Number: " + member.Number +  "<br/>Details: " + member.Other;
        $rootScope.showDeferredAlert(member.Name,text).then(function(){
            return;
        });
    }
    

    
    



  
  });
  