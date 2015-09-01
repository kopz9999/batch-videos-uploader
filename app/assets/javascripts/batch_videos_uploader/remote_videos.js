// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

//= require jquery-fileupload/basic
//= require batch_videos_uploader/async_videos

$(document).ready( function(){
  window.uploadVideosApp = new AsyncVideos.Grid( $('#video-upload-form'),
    $('#video-grid') );
});
