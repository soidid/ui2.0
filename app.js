
var app = angular.module("app", [
  "ngRoute",
  "ngTouch"
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
      when('/person/:cid/:qid',{
      templateUrl: 'partials/person.html',
      controller: 'PersonCtrl'
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
  
  DataService.getData('candidate').then(function(data){
    $scope.persons = [];
    for(var key in data){
        $scope.persons.push(data[key]);
    }
    console.log($scope.persons);
   
  });
  

  $scope.cover = "cover_small";
  if($( window ).width() > 400){
    $scope.cover = "cover_large";
  }

}]);


app.controller('PersonCtrl', ['$scope', 'DataService', '$location', '$sce', '$routeParams', '$route', function ($scope, DataService, $location, $sce, $routeParams, $route){

  $scope.topic = '所有主題';
  $scope.order = 'signatures_count';
  $scope.display_max = 10;
  $scope.comment = false;

  $scope.toggleComment = function () {
    console.log("comment toggle!");
    $scope.comment = !$scope.comment;
  };

  $scope.seeMore = function () {
    $scope.display_max += 10;
  };

  $scope.setRepondFilter = function(value){//value: true, false
    $scope.respondFilter = value;
  };
  
  $scope.isRepondFilterOn = function(){//value: true, false
    return $scope.respondFilter;
  };

  $scope.respondFilterFunction = function (n) {
    if($scope.respondFilter){
      if(n.responses)
          return n;
    }else{
      if(!n.responses)
          return n;
    }
  };

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
  
  $scope.random = function(q_signatures_count){
    //console.log( Math.round(Math.random()*10, 0) % 13);
    //return Math.round(Math.random()*10, 0) % 13;
    return q_signatures_count % 13;

  };
  $scope.randomName = function(q_signatures_count){
    var id = q_signatures_count % 13;
    var array = ['林祖儀', 'Walkingice Chu','Ellery Huang','傅柏蒼','Herzeleid Nnichts','DiDi Pan','賴建寰','謝繐吟','Keynes Cheng','Ly Cheng','Jason Chih-Hsin Liu','林瑋豐','鄭文燦'];
    return array[id];

  };
  $scope.toggleQuestion = function(qid){
    $scope.questionToggled = true;
    $scope.showRelatedItem = false;



    console.log("click"+qid);

    if(qid === false){
      $scope.focusQuestion = null;
      document.getElementById('focus-question').scrollTop = 0;
      
    }else{

      if($scope.focusQuestion === qid){
        $scope.focusQuestion = null;
        $scope.questionToggled = false;
        $scope.comment = false;
        $location.path('/person/'+$scope.candidate.id);//////
        $scope.showActions = 'question';
        
      }else{
        $scope.focusQuestion = qid;
        $scope.currentQ = $scope.questionsObj[qid];

        if($scope.currentQ.responses){
          $scope.showActions = 'response';

        }else{
          $scope.showActions = 'question';

        }
        console.log("$scope.showActions: "+$scope.showActions);
        
       
        
        //$location.hash(qid);
      }
    }
    
  };

  $scope.toggleActions = function(value) {
    $scope.showActions = value;
  };
  $scope.isActions = function(value) {
    return $scope.showActions === value;
  };
  
  
  // change route without reload the page
  /*
  var lastRoute = $route.current;
  $scope.$on('$locationChangeSuccess', function(event) {
      if($scope.questionToggled){

          $route.current = lastRoute;
          $scope.questionToggled = false;
      }
  });
  
  if($location.hash()) {// has is question id
     $scope.focusQuestion = $location.hash();
  }*/
  
  $scope.toggleSignFilter = function () {
      $scope.signFilter = !$scope.signFilter;
  };

  DataService.getData('candidate').then(function(data){
      
      var cid = $routeParams.cid;
      console.log(cid);

      if(data[cid]){
        $scope.candidate = data[cid];
        $scope.persons = [];
        for(var key in data){
            if(key !== cid){
                $scope.persons.push(data[key]);
            }
        }
        

      }

  });

  DataService.getData('user_signatures').then(function(data){
     $scope.signatures = data;

  });
  DataService.getData('posts').then(function(data){
     $scope.posts = data;

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

  

  $scope.go = function(path){
      console.log(path);
      $("body").scrollTop(0);
      $location.path(path);
      $scope.$apply();
  };
  $scope.switchPerson = function(name){
      console.log(name);
      $scope.focusQuestion = null;
      $("body").scrollTop(0);
      $location.path('/person/'+name+'/'+$scope.currentQ.id);

  };

  DataService.getData('questions').then(function(data){
      $scope.questionsObj = data;
      $scope.questions = [];
      for(var key in data){
        $scope.questions.push(data[key]);
      }
      if($routeParams.qid){
         $scope.toggleQuestion($routeParams.qid);

      }
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
