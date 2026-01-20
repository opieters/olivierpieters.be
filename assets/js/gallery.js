var gallery_ids = ['0'];
var galleries = document.getElementsByClassName("image-gallery");

for(i = 0; i < galleries.length; i++){
    tag = galleries[i].id;
    
    lightGallery(document.getElementById(tag), {
        thumbnail: false,
        selector: '.image',
        mode: 'lg-slide',
      });
  
    // init isotope
    var $grid = $("#"+tag).isotope({
      percentPosition: true,
      columnWidth: '.gallery-sizer',
      itemSelector: '.image-wrapper',
      layoutMode: "masonry"
    });
  
    // layout Isotope after each image loads
    $grid.imagesLoaded().progress( function() {
      $grid.masonry();
    });
  }
  