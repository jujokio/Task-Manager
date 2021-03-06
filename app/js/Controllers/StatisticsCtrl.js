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

/**
 * @ngdoc controller
 * @name StatisticsCtrl
 * @description 
 * Controls AddTask.html
 * Calls AppCtrl.js if needed
 * 
 * 
 * Display own goup's statistics. Stats are divided in categories and displayed for every group member.
 * Display every other groups total work hours
 * 
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
            $scope.init();
            $rootScope.activationFlags.tabInit3 = false;
        }
        else if (!$rootScope.activationFlags.isLoggedIn){
            $rootScope.doLogOut();
        }
    });


        
    /**
    * @ngdoc method
    * @name createOtherChart
    * @methodOf StatisticsCtrl
    * @description
    * do charts for other groups
    * 
    */
    $scope.createOtherChart = function (memberlist, worklist){
        var deferred = $q.defer();
        var container =  $(".item #container2");
        Highcharts.chart(container[0], {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: memberlist
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'workhours (h)'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            // series; dataList
            series: [{
                name: 'Hours',
                data: worklist
            }
        ] 
        });
        deferred.resolve();
        return deferred.promise;
    }



    /**
    * @ngdoc method
    * @name createOwnChart
    * @methodOf StatisticsCtrl
    * @description
    * do charts for own group
    * X-axis: Member names, Y-axis: workhours
    * Member names are in same order as workhours "a" did X hours in "Coding"
    * Is deferred no reject
    * 
    * @param {Array} memberlist list of groupmember names ["a","b",...]
    * @param {Array} series list of workhours [{"name":"Coding", "data":X},{"name":"coding", "data":Y},... ]
    */
    $scope.createOwnChart = function (memberlist, series){
        var deferred = $q.defer();
        var container =  $(".item #container");
        Highcharts.chart(container[0], {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Total work hours'
            },
            xAxis: {
                categories: ["Design","Coding","Presentation","Other"]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total work hours (h)'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            // series; dataList
            series: series
        });
        deferred.resolve();

        return deferred.promise;
    }



        /**
    * @ngdoc method
    * @name formatChartData
    * @methodOf StatisticsCtrl
    * @description
    * Format the received task entries for the ownChart
    * 
    * @param {Array} series list of workhours [{"name":"Coding", "data":X},{"name":"coding", "data":Y},... ]
    */
   $scope.formatChartData = function (series){
    var deferred = $q.defer();
    var dataset = [];

    for (l=0;l<$rootScope.ownGroup.groupMembers.length;l++){
        var memberName = $rootScope.ownGroup.groupMembers[l].name
        var formatedData = [0,0,0,0];
        for (k=0; k<series.length; k++){
                var taskType = series[k].task_type;
                var value = series[k].hours;
                if(memberName ==  series[k].name){
                    
                    var singleData = {
                        "name":memberName,
                        "data":value
                    }
                    if (taskType == "Design"){
                        formatedData[0] = value
                    }else if (taskType == "Coding"){
                        formatedData[1] = value;
                    }else if (taskType == "Presentation"){
                        formatedData[2] = value;
                    }else if (taskType == "Other"){
                        formatedData[3] = value;
                    }else{
                        console.log(singleData);
                    }
                }
            }
            var singleMember = {
                 name: memberName,
                data: formatedData
            }
            dataset.push(singleMember);
    }
    deferred.resolve(dataset);

    return deferred.promise;
}


    /**
    * @ngdoc method
    * @name getMemberName
    * @methodOf StatisticsCtrl
    * @description
    * Display group member's name
    * Is deferred, no rejects
    * 
    * @return {Array} array of names 
    */
    $scope.getMemberName = function(memberList){
        var deferred = $q.defer();
        if (memberList !=null || memberList.length!=0){
            var templist =[];
            for (j=0; j <memberList.length; j++){
                templist.push(memberList[j].name);
            }

                deferred.resolve(templist);
        }else{
            deferred.resolve(null);
        }
        return deferred.promise;
    } 


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
        $scope.allowedToSeeOthers = false;
        $rootScope.showWait("Loading group data...");
        $scope.groups = {};

        fetchJSON = {
            "email":$rootScope.profileSettings.email
        }
        $rootScope.askAPI(Settings.Post, "fetch_user_group_detailed_data", fetchJSON).then(function(response){
            if(response != null){
                $rootScope.ownGroup.group_id = response.group.group_id
                $rootScope.ownGroup.group = response.group;
                $rootScope.ownGroup.groupMembers = response.members;

                if(response.group.group_id % 2 != 0) {
                    $scope.allowedToSeeOthers = true;
                }
                var dataset = [];
                if (response.formated_tasks != null){
                    
                    $scope.formatChartData(response.formated_tasks).then(function(data){
                        dataset = data;
                    });
                }else{
                    var formatedSerie = [];
                    for(a=0;a<response.members.length;a++){
                        var singledata = {
                            name: response.members[a].name,
                            data: 0
                        }
                        dataset.push(singledata);
                    }
                }
                $scope.getMemberName($rootScope.ownGroup.groupMembers).then(function(names){
                    if(names != null){
                        $rootScope.ownGroup.groupMembers.nameList = names;
                        $scope.createOwnChart($rootScope.ownGroup.groupMembers.nameList, dataset).then(function(){
                            $rootScope.askAPI(Settings.Post, "fetch_group_stats", {}).then(function(response){
                                if(response != null){
                                    var groupNames = [];
                                    var groupHours = [];
                                    for (i=0; i<response.length;i++){ 
                                        if (response[i].group_id == $rootScope.ownGroup.group_id){
                                            groupNames.unshift(response[i].name);
                                            groupHours.unshift(response[i].total_work_hours);
                                        }else{
                                            groupNames.push(response[i].name);
                                            groupHours.push(response[i].total_work_hours);
                                        }
                                    }
                                    $scope.groups.names = groupNames;
                                    $scope.groups.total_work_hours = groupHours;
                                    if($scope.allowedToSeeOthers){
                                        $scope.createOtherChart($scope.groups.names, $scope.groups.total_work_hours).then(function(){
                                            $rootScope.hideWait();
                                            deferred.resolve();
                                        });
                                    }else{
                                            $rootScope.hideWait();
                                            deferred.resolve();
                                    }
                                } 
                            });
                        
                        });
                    }
                    
                });
                
            }
        });
        return deferred.promise;
    } 

  
  });
  