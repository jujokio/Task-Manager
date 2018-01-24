



angular.module('starter').controller('ManageGroupCtrl', function($scope, $rootScope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    
        // watch activationFlags.tabInit and do init if changed
        $scope.$watch('reloadActive.init', function() {
            $scope.init();   
            $rootScope.activationFlags.tabInit = false;
        });


    $scope.expand = {};
    $scope.expand.members = false;
    $scope.expand.timeline =false;

    /* [
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
*/


    /**
    * @ngdoc method
    * @name init
    * @methodOf ManageGroupCtrl
    * @description
    * 
    */
    $scope.init = function(){
        $rootScope.showWait("Loading group data...");
        if(!$rootScope.ownGroup){
            $rootScope.ownGroup = {};
            $rootScope.ownGroup.groupMembers = [];
            $rootScope.timelineItems = {};
        }
        if($rootScope.profileSettings.group_id != null){
            var fetchJSON = {
                "email":$rootScope.profileSettings.email
            }
            $rootScope.askAPI(Settings.Post, "fetch_user_group_data", fetchJSON).then(function(response){
                console.log(response);
                if(response != null){

                    $rootScope.ownGroup.group = response.group;
                    $rootScope.ownGroup.groupMembers = response.members;
                    $rootScope.timelineItems = response.last_8_days_task_entries;

                    console.log($rootScope.ownGroup);
                }
                $rootScope.hideWait();
            });
        }
    } 

    /**
    * @ngdoc method
    * @name showGroupMemberData
    * @methodOf ManageGroupCtrl
    * @description
    * Display user name and phonenumber if one is provided.
    */
    $scope.showGroupMemberData = function(member){
        var text = "Email: "+ member.email + "<br/>Number: " + member.phone_number;
        $rootScope.showDeferredAlert(member.Name,text).then(function(){
            return;
        });
    } 

    
    



  
  });
  