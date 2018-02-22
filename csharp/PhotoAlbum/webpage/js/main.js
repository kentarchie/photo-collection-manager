function fixValue(val)
{
   return ((val == undefined) ? "" : val);
}

$( document ).ready(function() {
    console.log('init: START');

    var numPictures= Album['pictures'].length;
    //console.log('init: number pictures =:'+numPictures+':');
    var thisAlbum = $('.album')[0];
    var example1 = new Vue({
            el: '#pictureBody',
            data: Album
    })

    setTimeout(function(){
        console.log('init starting featherlight');
        $('.thumbNail').featherlight();
        console.log('init finished featherlight');
    },200);
    console.log('init done');
});
