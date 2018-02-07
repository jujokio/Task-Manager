



angular.module('starter').controller('ManageGroupCtrl', function($q, $scope, $rootScope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    
    // watch activationFlags.tabInit and do init if changed
    $scope.$watch('activationFlags.tabInit2', function() {
        if($rootScope.activationFlags.tabInit2){
            console.log("Manage group init");
            $scope.init();   
            $rootScope.activationFlags.tabInit2 = false;
        }else if (!$rootScope.activationFlags.isLoggedIn){
            $rootScope.doLogOut();
        }
    });


    $scope.expand = {};
    $scope.expand.members = false;
    $scope.expand.timeline =false;

    /**
    * @ngdoc method
    * @name addUpvote
    * @methodOf ManageGroupCtrl
    * @description
    * upvote a single task.
    * Calls askAPI()
    * 
    * @param {Object} item task in hand.
    */
    $scope.addUpvote = function(item){
        if(!$rootScope.activationFlags.loading && !$rootScope.activationFlags.popupOpen){
            $rootScope.activationFlags.loading = true;
            $rootScope.showWait('Upvoting...');
            var voteJSON = {
                "email":$rootScope.profileSettings.email,
                "task_id":item.task_id                
            };
            $rootScope.askAPI(Settings.Post, "vote_task", voteJSON).then(function(response){
                if(response != null){
                    if(!item.liked){
                        item.likes++;
                        item.liked = true;
                    }
                    else{
                        item.likes--;
                        item.liked = false;
                    }

                }
                $rootScope.activationFlags.loading = false;
                $rootScope.hideWait();
                return;
            });
            $rootScope.activationFlags.loading = false;
            $rootScope.hideWait();
        }
    } 


    
    /**
    * @ngdoc method
    * @name displayDate
    * @methodOf ManageGroupCtrl
    * @description
    * Display date in string.
    * 
    * @param {Date} timestamp timestamp of the date
    * @return {String} day.month
    */
    $scope.displayDate = function(timestamp){
        var date = new Date(timestamp);
        var m = date.getMonth();
        m++;
        var parsedDate = date.getDate() +"."+ m;
        return parsedDate;
    } 



    /**
    * @ngdoc method
    * @name displayTime
    * @methodOf ManageGroupCtrl
    * @description
    * Display time in string.
    * 
    * @param {Date} timestamp timestamp of the date
    * @return {String} (h)h.mm
    */
    $scope.displayTime = function(timestamp){
        var time = new Date(timestamp);
        var paddingZero = ""; 
        if(time.getMinutes() < 10){ paddingZero = "0";}
        var parsedTimestamp = time.getHours() + ":" + paddingZero + time.getMinutes();
        return parsedTimestamp;
    } 



    /**
    * @ngdoc method
    * @name displayTimelineBody
    * @methodOf ManageGroupCtrl
    * @description
    * Get displayable string of task for timeline body 
    * 
    * @param {Object} item task at hand
    * @return {String} text for body
    */
    $scope.displayTimelineBody = function(item){
        var text = "";
        text += item.name +" Added "+ item.task_duration + "h to " + item.task_type + ".";
        return text
    } 



    /**
    * @ngdoc method
    * @name getMemberName
    * @methodOf ManageGroupCtrl
    * @description
    * Display group member's name
    * Is deferred, no rejects
    * 
    * @param {Number} id member's id#
    * @return {String} name or just id if no name was found.
    */
    $scope.getMemberName = function(id){
        var deferred = $q.defer();
        var flag = false;
        for (j=0; j < $rootScope.ownGroup.groupMembers.length; j++){
            if ($rootScope.ownGroup.groupMembers[j].id === id){
                flag = true;
                deferred.resolve($rootScope.ownGroup.groupMembers[j].name);
                break;
            }
        }
        if(!flag){
            deferred.resolve(id);
        }
        return deferred.promise;
    } 

    

    /**
    * @ngdoc method
    * @name init
    * @methodOf ManageGroupCtrl
    * @description
    * init, fired every time when browsed to the manageGroup tab
    * Calls askAPI(), initTimeline()
    * 
    */
    $scope.init = function(){
        var deferred = $q.defer();
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
                if(response != null){
                    $rootScope.ownGroup.group = response.group;
                    $rootScope.profileSettings.group_id = response.group.group_id;
                    $rootScope.ownGroup.groupMembers = response.members;
                    $rootScope.timelineItems = response.last_8_days_task_entries;
                    $scope.pushedDates = {};

                    if($rootScope.timelineItems.length > 0 ){
                        for(i = 0; i < $rootScope.timelineItems.length; i++){
                            var taskItem = $rootScope.timelineItems[i]
                            var temp = $scope.displayDate(taskItem.task_added_timestamp);
                            if(taskItem.likes == null){
                                taskItem.likes = 0;
                            }
                            $scope.initTimeline(temp, taskItem).then(function(){

                            });
                        }
                    }
                }
                $rootScope.hideWait();
                console.log("pushed dates is finally");
                console.log($scope.pushedDates);
                deferred.resolve();
            });
        }
        return deferred.promise;
    } 



    /**
    * @ngdoc method
    * @name initTimeline
    * @methodOf ManageGroupCtrl
    * @description
    * init timeline items, part of init().
    * Group each task for specific date.
    * 
    * @param {Date} temp tasks are grouped by date
    * @param {Object} taskItem task at hand    
    */
    $scope.initTimeline = function(temp, taskItem){
        var deferred = $q.defer();
        var flag = false;

        $scope.getMemberName($rootScope.timelineItems[i].student_id).then(function(name){
            taskItem.name = name;
            
            if(!$scope.pushedDates[temp]){
                $scope.pushedDates[temp] = [];
            }

            for(k=0; k<$scope.pushedDates[temp].length; k++){
                if($scope.pushedDates[temp][k].task_id == taskItem.task_id){
                    flag =true;
                }
            }
            if(!flag){
                $scope.pushedDates[temp].push(taskItem);
            }
            deferred.resolve();
         });
        
        return deferred.promise;
    }



    /**
    * @ngdoc method
    * @name leaveGroup
    * @methodOf ManageGroupCtrl
    * @description
    * Leave your group permanently
    * Calls askAPI()
    * 
    */
    $scope.leaveGroup = function(){
        $rootScope.showDeferredPopup("ALERT!","Are you sure you want to leave your group?","LEAVE YOUR GROUP?").then(function(res){
            if(!res){
                return;
            }else{
                $rootScope.showDeferredPopup("PLEASE VERIFY!","Are you REALLY sure you want to leave your group?","YOU CAN STILL CHANGE YOUR MIND! Think of the children!").then(function(res){
                    if(!res){
                        return;
                    }
                    if(!$rootScope.activationFlags.loading && !$rootScope.activationFlags.popupOpen){
                        $rootScope.activationFlags.loading = true;
                        $rootScope.showWait('Leaving...');
                        var leaveJSON = {
                            "email":$rootScope.profileSettings.email,
                            "group_id": $rootScope.profileSettings.group_id              
                        };
                        $rootScope.askAPI(Settings.Post, "leave_group", leaveJSON).then(function(response){
                            if(response != null){
                                $rootScope.showDeferredAlert("You have left the group succesfully.","Please login again and choose a new group").then(function(res){
                                    $rootScope.activationFlags.loading = false;
                                    $rootScope.doLogOut();
                                    $rootScope.hideWait();
                                });// leave alert
                            }
                            $rootScope.activationFlags.loading = false;
                            $rootScope.doLogOut();
                            $rootScope.hideWait();
                        });// askAPI
                    }// if ! popup && ! loading 
                });//popup2
            }// if res
        });//popup1
    } 



    /**
    * @ngdoc method
    * @name showGroupMemberData
    * @methodOf ManageGroupCtrl
    * @description
    * Display user name and phonenumber if one is provided.
    * 
    * @param {Object} member member json
    */
    $scope.showGroupMemberData = function(member){
        var text = "Email: "+ member.email + "<br/>Number: " + member.phone_number;
        $rootScope.showDeferredAlert(member.Name,text).then(function(){
            return;
        });
    } 

  
  });
  