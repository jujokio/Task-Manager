



angular.module('starter').controller('AddTaskCtrl', function($scope, $rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


      // watch activationFlags.tabInit and do init if changed
    $scope.$watch('reloadActive.init', function() {
        if($rootScope.activationFlags.tabInit){
            //$scope.init();
            $rootScope.activationFlags.tabInit = false;
        }
    });


    $scope.Task = {};
    $scope.Task.duration = 0;
    $scope.Categories = {
        "0":"Coding",
        "1":"Design",
        "2":"Presentation",
        "3":"Other",    
    };

    

    /**
    * @ngdoc method
    * @name displayEnum
    * @methodOf AddTaskCtrl
    * @description
    * 
    */
    $scope.displayEnum = function (num){
        console.log("display enum");
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
                        $rootScope.activationFlags.loading = false;
                        $rootScope.hideWait();
                        $scope.Task = {};
                    
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
