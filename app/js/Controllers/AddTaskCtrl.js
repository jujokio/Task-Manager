



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



    $scope.clear = function (){
        console.log("clear");
        console.log($scope.Task);
        $scope.Task = {};
                
    };

    $scope.displayEnum = function (num){
        console.log("display enum");
        return $scope.Categories[num];
    };


    $scope.submit = function (){
        console.log("submit");
        console.log($scope.Task);
        var text = "Send this: <br/> <br/>Duration: " + $scope.Task.duration +" <br/> <br/>Category: " + $scope.Task.category;
        $rootScope.showDeferredPopup("Confirm", text).then(function(res){
            if(res){
                console.log("sent");
                $scope.Task = {};
            }
            
        });
        
    };
    
    $scope.updateTask = function (cat){
        console.log("update task");
        $scope.Task.category = cat;
        console.log($scope.Task);
    };
});
