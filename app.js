
var app = angular.module("app", [
  "ngRoute"
]);

app.filter('htmlToPlaintext', function() {
    return function(text) {
      var plain = String(text).replace(/<[^>]+>/gm, '');

      plain.replace(/&nbsp;/gi,' ');
      return plain;
    }
});

//http://stackoverflow.com/questions/16310298/if-a-ngsrc-path-resolves-to-a-404-is-there-a-way-to-fallback-to-a-default
app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {

      scope.$watch(function() {
          return attrs['ngSrc'];
        }, function (value) {
          if (!value) {
            element.attr('src', attrs.errSrc);
          }
      });

      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
});

app.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider){
    $routeProvider.
      when('/person/:cid',{
      templateUrl: 'partials/person.html',
      controller: 'PersonCtrl'
    }).
      when('/person/:cid/respond',{
      templateUrl: 'partials/person-respond.html',
      controller: 'PersonCtrl'
    }).
      when('/person/:cid/about',{
      templateUrl: 'partials/person-about.html',
      controller: 'PersonCtrl'
    }).
      when('/groups/:cid',{
      templateUrl: 'partials/group.html',
      controller: 'GroupCtrl'
    }).
      when('/groups/:cid/respond',{
      templateUrl: 'partials/group-respond.html',
      controller: 'GroupCtrl'
    }).
      when('/groups/:cid/person',{
      templateUrl: 'partials/group-person.html',
      controller: 'GroupCtrl'
    }).
      when('/how-to-ask',{
      templateUrl: 'partials/how-to-ask.html',
      controller: 'IndexCtrl'
    }).
      when('/terms',{
      templateUrl: 'partials/terms.html'
    }).
      when('/contact',{
      templateUrl: 'partials/contact.html'
    }).
      otherwise({
      redirectTo:'/',
      templateUrl: 'partials/index.html',
      controller: 'IndexCtrl'
    });

    //$locationProvider.html5Mode(true);

  }
]);

app.factory('DataService', function ($http, $q){

  var DataService = {};
  DataService.getData = function(path){
    var deferred = $q.defer();
    $http.get('data/'+path+'.json').
        success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          deferred.resolve(data);
        });
    return deferred.promise;
  };


  return DataService;
})

app.controller('AuthCtrl',['$scope', 'DataService', '$location', function($scope, DataService, $location){
  $scope.login = function(){

    $scope.user = {"name" : "username tool ongcanno tshowall"};
    //$("#notification").removeClass("notification_hide");

    $("#notification").text("成功登入！");
    setTimeout(function(){
      $("#notification").addClass("notification_show");
      setTimeout(function(){
        $("#notification").removeClass("notification_show");

      },2500);

    },100);
    
    

  };
  $scope.logout = function(){
    $scope.user = null;

    $("#notification").text("成功登出！");
    setTimeout(function(){
      $("#notification").addClass("notification_show");
      setTimeout(function(){
        $("#notification").removeClass("notification_show");

      },2500);
    },100);
  };

  $scope.toggleCandidateMenu = function(){
    $scope.showCandidateMenu = !$scope.showCandidateMenu;
   
  };
  $scope.toggleUserMenu = function(){
    $scope.showUserMenu = !$scope.showUserMenu;
    
  };
  DataService.getData('candidate').then(function(data){
      $scope.candidates = data;
  });
  $scope.chooseCandidate = function(cid){
    
    var validID = ["5","6","7"];
    
    if(validID.indexOf(cid)!== -1){
        $scope.candidate = $scope.candidates[cid];
        $location.path('/policy/'+cid);
    }
    
  };

}]);
app.controller('NavCtrl', ['$scope', 'DataService', '$location', '$sce', function ($scope, DataService, $location, $sce){

  $scope.go = function(path){
      $("body").scrollTop(0);
      $location.path(path);
  };

  $scope.showsidebar = function(value){
      if(value === 'toggle'){
          $scope.sidebar = !$scope.sidebar;
      }else{
          $scope.sidebar = value;
      }
  };



  

}]);
app.controller('IndexCtrl', ['$scope', 'DataService', '$location', '$sce', function ($scope, DataService, $location, $sce){
  
  $scope.go = function(path){
      $("body").scrollTop(0);
      $location.path(path);
  };
  DataService.getData('candidate').then(function(data){
      $scope.candidates = data;
  });
  $scope.selectedCollectionMenu = 'collecting';
  $scope.isCollectionMenuSelected = function(value){
      return $scope.selectedCollectionMenu === value;
  };
  $scope.setCollectionMenuitem = function(value){
      $scope.selectedCollectionMenu = value;
  };
  $scope.persons = [
  { 
    "name":"蔡英文",
    "answered":20,
    "latest":"12/14",
    "deadline" : "12/31"

  },
  { 
    "name":"吳敦義",
    "answered":3,
    "latest":"10/01"
  },
  { 
    "name":"朱立倫",
    "answered":10,
    "latest":"11/28",
    "deadline" : "12/31"
  },
  { 
    "name":"柯文哲",
    "answered":43,
    "latest":"9/28"
  },
  { 
    "name":"賴清德",
    "answered":3,
    "latest":"7/01"
  },
  { 
    "name":"陳菊",
    "answered":12,
    "latest":"6/17"
  },
  { 
    "name":"林佳龍",
    "answered":1,
    "latest":"5/4"
  }];

  $scope.groups = [
  { 
    "name":"總統參選人",
    "answered":1,
    "latest":"5/4"
  }
  ];

}]);


app.controller('PersonCtrl', ['$scope', 'DataService', '$location', '$sce', '$routeParams', '$route', function ($scope, DataService, $location, $sce, $routeParams, $route){

  $scope.order = 'signatures_count';

  $scope.toggleEventmenu = function () {
    $scope.eventmenu = !$scope.eventmenu;
  };
  $scope.toggleToolbar = function () {
    $scope.showtoolbar = !$scope.showtoolbar;
    $scope.showinfo = false;
    $scope.showsearch = false;
  };

  $scope.toggleInfo = function () {
    $scope.showinfo = !$scope.showinfo;
    $scope.showtoolbar = false;
    $scope.showsearch = false;

  };

  $scope.toggleSearch = function () {
    $scope.showsearch = !$scope.showsearch;
    $scope.showtoolbar = false;
    $scope.showinfo = false;
  };


  $scope.toggleQuestion = function(qid){
    $scope.questionToggled = true;

    if(qid === false){
      $scope.focusQuestion = false;
      document.getElementById('focus-question').scrollTop = 0;
      

    }else{

      if($scope.focusQuestion === qid){
        $scope.focusQuestion = false;
        
      }else{
        $scope.focusQuestion = qid;
        $scope.currentQ = $scope.questionsObj[qid];
        //$location.hash(qid);
      }
    }
    
  };
  
  // change route without reload the page
  var lastRoute = $route.current;
  $scope.$on('$locationChangeSuccess', function(event) {
      if($scope.questionToggled){
          $route.current = lastRoute;
          $scope.questionToggled = false;
      }
  });
  

  if($location.hash()) {// has is question id
     $scope.focusQuestion = $location.hash();
  }
  
  $scope.toggleSignFilter = function () {
      $scope.signFilter = !$scope.signFilter;
  };

  DataService.getData('candidate').then(function(data){
      
      var cid = $routeParams.cid;
      console.log(cid);

      if(data[cid]){
        $scope.candidate = data[cid];

      }

  });

  DataService.getData('user_signatures').then(function(data){
     $scope.signatures = data;

  });
  $scope.hasSigned = function (qid) {
      if(qid)
         return $scope.signatures[qid];
  };
  $scope.sign = function(qid) {
      $scope.signatures[qid] = true;
  };
  

  $scope.showLoginTip = function () {
    
    $("#notification").text("請先登入");
    setTimeout(function(){
      $("#notification").addClass("notification_show");
      setTimeout(function(){
          $("#notification").removeClass("notification_show");

      },2500);

    },100);

  };

  $scope.previousPolicy = function(){
    $scope.pageControlClicked = true;
    $location.hash("");
    
    var pid = parseInt($routeParams.pid)-1;
    if(pid < 1)
       pid = $scope.policyLength;

    $location.path('/policy/'+$routeParams.cid+'/'+pid);

  };
  $scope.nextPolicy = function(){
    $scope.pageControlClicked = true;
    $location.hash("");
  
    console.log($scope.policyLength);
    var pid = parseInt($routeParams.pid)+1;
    if(pid > $scope.policyLength)
       pid = 1;

    $location.path('/policy/'+$routeParams.cid+'/'+pid);

  };

  $scope.go = function(path){
      $("body").scrollTop(0);
      $location.path(path);
  };

  DataService.getData('questions').then(function(data){
      $scope.questionsObj = data;
      $scope.questions = [];
      for(var key in data){
        $scope.questions.push(data[key]);
      }
  });

  DataService.getData('policy').then(function(data){
      var validID = ["5","6","7"];
      var cid = $routeParams.cid;

     

  });

  $scope.showQuestion = function(qid){
    return $scope.focusQuestion === qid;
  };

  $scope.toTrusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
  };
  $scope.togglePolicy = function(){
    $scope.policyShowState = !$scope.policyShowState;
  };
  $scope.showPolicy = function(){
    return $scope.policyShowState;
  };
  $scope.resetFocus = function(){
      //console.log("RESET");
      $scope.policyShowState = false;
      $scope.focusQuestion = false;  
  };
  $scope.toogleAskQuestionForm = function(){
      if(!$scope.liveAskQuestionForm)
         $scope.liveAskQuestionForm = true;
      $scope.showAskQuestionForm = !$scope.showAskQuestionForm;
  };
  $scope.deleteAskQuestionForm = function(){
      $scope.liveAskQuestionForm = false;
  };

}]);
app.controller('GroupCtrl', ['$scope', 'DataService', '$location', '$sce', '$routeParams', '$route', function ($scope, DataService, $location, $sce, $routeParams, $route){

  $scope.order = 'signatures_count';
  $scope.persons = [
  { 
    "name":"蔡英文",
    "answered":20,
    "latest":"12/14",
    "deadline" : "12/31"

  },
  { 
    "name":"吳敦義",
    "answered":3,
    "latest":"10/01"
  }];
  

  $scope.toggleQuestion = function(qid){
    $scope.questionToggled = true;
    if($scope.focusQuestion === qid){
        $scope.focusQuestion = false;
        
    }else{
        $scope.focusQuestion = qid;
        $location.hash(qid);
    }

  };
  
  // change route without reload the page
  var lastRoute = $route.current;
  $scope.$on('$locationChangeSuccess', function(event) {
      if($scope.questionToggled){
          $route.current = lastRoute;
          $scope.questionToggled = false;
      }
  });
  

  if($location.hash()) {// has is question id
     $scope.focusQuestion = $location.hash();
  }
  
  $scope.toggleSignFilter = function () {
      $scope.signFilter = !$scope.signFilter;
  };

  DataService.getData('candidate').then(function(data){
      
      var cid = $routeParams.cid;

      if(data[cid]){
        $scope.candidate = data[cid];

      }

  });

  DataService.getData('user_signatures').then(function(data){
     $scope.signatures = data;

  });
  $scope.hasSigned = function (qid) {
      return $scope.signatures[qid];
  };
  $scope.sign = function(qid) {
      $scope.signatures[qid] = true;
  };
  

  $scope.showLoginTip = function () {
    
    $("#notification").text("請先登入");
    setTimeout(function(){
      $("#notification").addClass("notification_show");
      setTimeout(function(){
          $("#notification").removeClass("notification_show");

      },2500);

    },100);

  };

  $scope.previousPolicy = function(){
    $scope.pageControlClicked = true;
    $location.hash("");
    
    var pid = parseInt($routeParams.pid)-1;
    if(pid < 1)
       pid = $scope.policyLength;

    $location.path('/policy/'+$routeParams.cid+'/'+pid);

  };
  $scope.nextPolicy = function(){
    $scope.pageControlClicked = true;
    $location.hash("");
  
    console.log($scope.policyLength);
    var pid = parseInt($routeParams.pid)+1;
    if(pid > $scope.policyLength)
       pid = 1;

    $location.path('/policy/'+$routeParams.cid+'/'+pid);

  };

  $scope.go = function(path){
      $("body").scrollTop(0);
      $location.path(path);
  };

  DataService.getData('questions').then(function(data){
      $scope.questions = data;
  });

  DataService.getData('policy').then(function(data){
      var validID = ["5","6","7"];
      var cid = $routeParams.cid;

     

  });

  $scope.showQuestion = function(qid){
    return $scope.focusQuestion === qid;
  };

  $scope.toTrusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
  };
  $scope.togglePolicy = function(){
    $scope.policyShowState = !$scope.policyShowState;
  };
  $scope.showPolicy = function(){
    return $scope.policyShowState;
  };
  $scope.resetFocus = function(){
      //console.log("RESET");
      $scope.policyShowState = false;
      $scope.focusQuestion = false;  
  };
  $scope.toogleAskQuestionForm = function(){
      if(!$scope.liveAskQuestionForm)
         $scope.liveAskQuestionForm = true;
      $scope.showAskQuestionForm = !$scope.showAskQuestionForm;
  };
  $scope.deleteAskQuestionForm = function(){
      $scope.liveAskQuestionForm = false;
  };

}]);

app.controller('RankCtrl', ['$scope', 'DataService', '$location', '$sce', '$routeParams', function ($scope, DataService, $location, $sce, $routeParams){

  $scope.go = function(path){
      $("body").scrollTop(0);
      $location.path(path);
  };

  DataService.getData('candidate').then(function(data){
      var validID = ["5","6","7"];
      var cid = $routeParams.cid;

      if(validID.indexOf($routeParams.cid)!== -1){
        $scope.candidate = data[cid];
      }else{
        $location.path('/');
      }

  });

  DataService.getData('questions').then(function(data){
      $scope.questions = [];

      var validID = ["5","6","7"];
      var cid = $routeParams.cid;

      if(validID.indexOf($routeParams.cid)!== -1){
          for(var pid in data[cid]){
              for(var key in data[cid][pid]){
                  //console.log(data[cid][pid][key]);
                  $scope.questions.push(data[cid][pid][key]);
              }
          }

      }else{
        $location.path('/');
      }



  });

  $scope.showQuestion = function(qid){
    return $scope.focusQuestion === qid;
  };

  $scope.toggleQuestion = function(qid){
    if($scope.focusQuestion === qid){
        $scope.focusQuestion = false;

    }else{
        $scope.focusQuestion = qid;
    }

  };

  $scope.resetFocus = function(){
      console.log("RESET");
      $scope.policyShowState = false;
      $scope.focusQuestion = false;

  };



}]);
