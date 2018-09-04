  $(function () {
    $('#listings .card-header-tabs').tab();

    $(document).on("click", "#synopsis", function(){
      $(this).toggleClass("crop-text");
    });

    $(document).on("click", ".video-btn", function () {
      $videoSrc = $(this).data( "src" );
      return false;
    });

    // when the modal is opened autoplay it  
    $('#myModal').on('shown.bs.modal', function (e) {            
      // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
      $("#video").attr('src', $videoSrc + "?rel=0&amp;autoplay=1" ); 
    });          
      
    // stop playing the youtube video when I close the modal
    $('#myModal').on('hide.bs.modal', function (e) {
        // a poor man's stop video
        $("#video").attr('src', ''); 
    });
  })

  // Using this to avoid Flash Of Unstyled Content
  function js_Load() {
    document.body.style.visibility='visible';
  }
