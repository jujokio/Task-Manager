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
        $scope.$watch('activationFlags.tabInit', function() {
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
                temp.Id = new Date().getTime()/i;
                $scope.groups.push(temp);
            }
        };
  
  });
  