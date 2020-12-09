function play_se(){
    var BGM = new Audio(`BGM.mp3`);
    BGM.play();
}


$(function(){
    

    history.pushState(null, null, null);
    $(window).on("popstate", function(e){
      if (!e.originalEvent.state){
        history.pushState(null, null, null);
        return;
      }
    });


    $(`.modal`).modal();
    $(`#alert`).modal(`open`);
    $(`#close`).click(function(){
        $(`#alert`).modal(`close`);
        play_se();
    });


    var device = navigator.userAgent;
    $(`#device`).text(device);
});
