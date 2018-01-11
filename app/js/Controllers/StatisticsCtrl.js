



angular.module('starter').controller('StatisticsCtrl', function($rootScope, $scope, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
        $scope.groups = [];

            // watch activationFlags.tabInit and do init if changed
        $scope.$watch('reloadActive.init', function() {
            $scope.init();
            $rootScope.activationFlags.tabInit = false;
        });
    
        $scope.init = function (){
            console.log("Hello stats");
            for(var i=0;i<3;i++){
                var temp = {};
                temp.GroupName = "group " + i;
                temp.groupMembers = [
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
                temp.expand = false; 
                temp.Id = new Date().getTime();
                $scope.groups.push(temp);
            }
        };
  
  });
  