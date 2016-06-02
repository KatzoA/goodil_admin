// AddDeal CONTROLLER
function addDealController($scope, $http, Upload, shopsService, categoriesService, subCategoriesService, brandsService, bvService, dealsService, NgMap) {
  $scope.title = "Add a Deal";
  $scope.deal = {};
  $scope.centerMap = 'current-location';

  shopsService.getShops().then(function(res) {
    $scope.shops = res.data;
  });

  brandsService.getBrands().then(function(res) {
    $scope.brands = res.data;
  });

  subCategoriesService.getSubCategories().then(function(res) {
    $scope.subCategories = res.data;
  });

  categoriesService.getCategories().then(function(res) {
    $scope.categories = res.data;
  });

  NgMap.getMap().then(function(map) {
    $scope.map = map;
  });

  $scope.addDeal = function(deal) {
    var createdDeal = deal;
    Upload.upload({
      url: '/deal/uploadDealImage',
      file: $scope.file
    }).progress(function(event) {
      var progressPercentage = parseInt(100.0 * event.loaded / event.total);
      console.log('progress: ' + progressPercentage + '% ' + event.config.file.name);
    }).success(function(data, status, headers, config) {
      console.log('file ' + config.file.name + ' uploaded. Response: ' + JSON.stringify(data));
      createdDeal.image = data.path;
      createdDeal.subCategory = deal.subCategory._id;
      createdDeal.shop = deal.shop._id;
      console.log(createdDeal);
      dealsService.createDeal(createdDeal).then(function(res) {
        console.log('deal created');
      });
    });
    $scope.deal = {};
  };

  $scope.changePlace = function() {
    setTimeout($scope.centerMap = $scope.deal.shop.point.coordinates, 1);
  };

  $scope.addShop = function() {
    var addedShop = {};

    addedShop.name = $scope.addedShop.details.name;
    addedShop.address = $scope.addedShop.details.formatted_address.split(',');
    addedShop.logo = $scope.addedShop.logo;
    addedShop.brand = $scope.selectedBrand;
    addedShop.catchment_area_radius = $scope.addedShop.catchment_area_radius;
    addedShop.point = {
      type: "Point",
      coordinates: [$scope.addedShop.details.geometry.location.lat(), $scope.addedShop.details.geometry.location.lng()]
    };

    bvService.findOneBV($scope.addedShop.details.address_components[$scope.addedShop.details.address_components.length - 1].short_name).then(function(res) {
      addedShop.bassinDeVie = res.data;
      $scope.deal.shop = _.clone(addedShop);
      console.log('addedShop: ' + addedShop);
      addedShop.bassinDeVie = addedShop.bassinDeVie._id;
      addedShop.brand = $scope.selectedBrand._id;
      shopsService.createShop(addedShop).then(function(res) {
        shopsService.getShops().then(function(res) {
          $scope.shops = res.data;
        });
      });
    });
    $scope.addedShop = {};
  };

  $scope.addSubCategory = function() {
    $scope.deal.subCategory = $scope.addedSubCategory;
    $scope.addedSubCategory.category_id = $scope.selectedCategory._id;
    subCategoriesService.createSubCategory($scope.addedSubCategory).then(function(res) {
      subCategoriesService.getSubCategories().then(function(res) {
        $scope.subCategories = res.data;
      });
    });
    $scope.addedSubCategory = {};
  };

  var currentTime = new Date();
  $scope.currentTime = currentTime;
  $scope.month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  $scope.monthShort = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.weekdaysFull = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  $scope.weekdaysLetter = ['L', 'M', 'Me', 'J', 'V', 'S', 'D'];
  $scope.disable = [false, 1, 7];
  $scope.today = 'Aujourd\'hui';
  $scope.clear = 'Rafraichir';
  $scope.close = 'Fermer';
  $scope.minDate = $scope.deal.start_date;

}
