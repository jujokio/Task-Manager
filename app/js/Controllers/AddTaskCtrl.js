


/**
 * @ngdoc controller
 * @name AddTaskCtrl
 * @description 
 * Controls AddTask.html
 * Calls AppCtrl.js if needed
 * 
 * 
 * Add task 
 * 
 */

angular.module('starter').controller('AddTaskCtrl', function($scope, $rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    $scope.Categories = {
        "0":"Coding",
        "1":"Design",
        "2":"Presentation",
        "3":"Other"
    };

      // watch activationFlags.tabInit and do init if changed
    $scope.$watch('activationFlags.tabInit1', function() {
        if($rootScope.activationFlags.tabInit1){
            $scope.Task = {};
            $scope.Task.duration = 0;
            $rootScope.activationFlags.tabInit1 = false;
        }else if (!$rootScope.activationFlags.isLoggedIn){
            $rootScope.doLogOut();
        }
    });




    

    /**
    * @ngdoc method
    * @name displayEnum
    * @methodOf AddTaskCtrl
    * @description
    * 
    */
    $scope.displayEnum = function (num){
        return $scope.Categories[num];
    };



    /**
    * @ngdoc method
    * @name submit
    * @methodOf AddTaskCtrl
    * @description
    * 
    */
    $scope.submit = function (){
        var text = "Submit this as your task? <br/><br/>Duration: " + $scope.Task.duration +"H <br/>Category: " + $scope.Task.category;
        $rootScope.showDeferredPopup("Confirm", text).then(function(res){
            if(res){
                $rootScope.showWait('Sending...');
                $rootScope.activationFlags.loading = true;
                var taskJSON = {
                    "email":$rootScope.profileSettings.email,
                    "hour_count":$scope.Task.duration,
                    "task_type": $scope.Task.category               
                };
                $rootScope.askAPI(Settings.Post, "add_task", taskJSON).then(function(response){
                    if(response != null){
                        $rootScope.hideWait();
                        $rootScope.showDeferredAlert("Success", "Task added. Well done!").then(function(res){
                            $rootScope.activationFlags.loading = false;
                            $scope.Task = {};
                        });
                    
                    }else{
                        $rootScope.activationFlags.loading = false;
                        $rootScope.hideWait();
                    }
                });//askAPI
            }//if confirrm true
        });//confirm
        
    };



    /**
    * @ngdoc method
    * @name updateTask
    * @methodOf AddTaskCtrl
    * @description
    * Update task.category
    *
    * @param {Object} cat 
    */
    $scope.updateTask = function (cat){
        $scope.Task.category = cat;
    };
});
