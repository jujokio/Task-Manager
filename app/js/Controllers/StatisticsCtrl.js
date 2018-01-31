/*

// response for calling /gm/fetch_user_group_data(

        {
            "group": {
                "creation_timestamp": 1515714042, 
                "description": "The guys group", 
                "group_id": 9, 
                "name": "Amicus", 
                "total_task_hours": 36
            }, 
            "last_8_days_task_entries": [
                {
                "group_id": 9, 
                "student_id": 3, 
                "task_added_timestamp": 1515717053, 
                "task_duration": 12, 
                "task_id": 3, 
                "task_type": "Coding"
                }, 
                {
                "group_id": 9, 
                "student_id": 3, 
                "task_added_timestamp": 1515717110, 
                "task_duration": 12, 
                "task_id": 4, 
                "task_type": "documentation"
                }, 
                {
                "group_id": 9, 
                "student_id": 3, 
                "task_added_timestamp": 1515717122, 
                "task_duration": 12, 
                "task_id": 5, 
                "task_type": "other"
                }
            ], 
            "members": [
                {
                "email": "juusi@oulu.fi", 
                "group_id": 9, 
                "group_join_timestamp": 1515714135, 
                "id": 3, 
                "name": "jukio juusi", 
                "phone_number": null, 
                "student_number": null
                }
            ]
        }


*/


angular.module('starter').controller('StatisticsCtrl', function($q, $rootScope, $scope, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
       

        // watch activationFlags.tabInit and do init if changed
        $scope.$watch('activationFlags.tabInit3', function() {
            if($rootScope.activationFlags.tabInit3){
                console.log("stats init");
                $scope.init();
                $rootScope.activationFlags.tabInit3 = false;
            }
        });


        $scope.groups = [];
    
        /*
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
                temp.Id = new Date().getTime()/i;
                $scope.groups.push(temp);
            }
        };

        */


    /**
    * @ngdoc method
    * @name init
    * @methodOf StatisticsCtrl
    * @description
    * init, fired every time when browsed to the Statistics tab
    * Calls askAPI()
    * 
    */
    $scope.init = function(){
        var deferred = $q.defer();
        $rootScope.showWait("Loading group data...");
        if(!$rootScope.ownGroup){
            $rootScope.ownGroup = {};
            $rootScope.ownGroup.groupMembers = [];
        }
        if($rootScope.profileSettings.group_id != null){
            $rootScope.askAPI(Settings.Get, "fetch_groups").then(function(response){
                console.log("response is");
                console.log(response);
                if(response != null){
                    for (i=0; i<response.length;i++){
                        if (response[i].group_id == $rootScope.profileSettings.group_id){
                            if($rootScope.ownGroup.groupMembers.length==0){
                                $rootScope.ownGroup = response[i];
                            }
                        }else{
                            $scope.groups.push(response[i]);
                        }
                    }
                }
                $rootScope.hideWait();
                console.log("pushed groups is finally");
                console.log($scope.groups);
                deferred.resolve();
            });
        }
        return deferred.promise;
    } 
  
  });
  