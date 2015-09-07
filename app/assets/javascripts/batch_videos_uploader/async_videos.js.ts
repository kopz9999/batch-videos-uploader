declare var $:any;

module AsyncVideos {
  export class Grid {
    currentForm: AsyncVideos.Form;
    previousForm: AsyncVideos.Form;
    formContainer: any;
    container: any;
    emptyContainer: any;
    loader: any;
    apiEndpoint: string;
    records: Array<AsyncVideos.Record>;
    constructor(formContainer: any, container: any, emptyContainer: any,
        loader: any, apiEndpoint: string) {
      this.formContainer = formContainer;
      this.container = container;
      this.emptyContainer = emptyContainer;
      this.loader = loader;
      this.apiEndpoint = apiEndpoint;
      this.records = [];
      this.initCurrentForm();
      this.requestData();
    }
    loading(){
      this.loader.show();
    }
    loaded(){
      this.loader.hide();
    }
    initCurrentForm() {
      this.currentForm = new AsyncVideos.Form(this.formContainer.find('form'),
        this);
    }
    requestData() {
      this.loading();
      $.ajax({
        url: this.apiEndpoint,
        type: 'GET',
        complete: this.loaded,
        success: this.processData,
        context: this
      });
    }
    verifyRecords() {
      if (this.records.length > 0) {
        this.emptyContainer.hide();
        this.container.show();
      } else{
        this.emptyContainer.show();
        this.container.hide();
      }
    }
    processData(response:any) {
      var _self = this;
      response.forEach((remoteVideo:any) => _self.processRecord(remoteVideo));
      this.verifyRecords();
    }
    processRecord( remoteVideo:any ) {
      var record = new Record(this);
      this.container.find('tbody').append( record.container );
      record.setModel( remoteVideo );
      this.records.push(record);
    }
    appendRecord(record: Record){
      this.container.find('tbody').append( record.container );
      this.refreshForm();
      record.initProgressBar();
      this.records.push(record);
      this.verifyRecords();
    }
    onRemoveSuccess(record: Record){
      var index = this.records.indexOf(record);
      if (index > -1) {
        record.container.remove();
        this.records.splice(index, 1);
        this.verifyRecords();
      }
    }
    removeRecord(record: Record){
      var deleteURL:string = this.apiEndpoint+'/'+
        record.remoteVideo.remote_id;
      this.loading();
      $.ajax({
        url: deleteURL,
        type: 'DELETE',
        complete: this.loaded,
        success: () => { this.onRemoveSuccess(record) },
        context: this
      });
    }
    refreshForm() {
      var newFormContainer = this.currentForm.container.clone();
      newFormContainer[0].reset();
      this.previousForm = this.currentForm;
      this.currentForm.container.hide();
      this.formContainer.append( newFormContainer );
      this.currentForm = new AsyncVideos.Form(newFormContainer, this);
      this.currentForm.updateButton();
    }
  }
  export class Record {
    container: any;
    titleContainer: any;
    progressBarContainer: any;
    actionsContainer: any;
    progressBar: any;
    progressBarTextOptions: any;
    remoteVideo: any;
    grid: Grid;
    constructor(grid: Grid) {
      this.grid = grid;
      this.progressBarTextOptions = {
        active: '{percent}% Uploaded',
        success: 'Video Uploaded'
      };
      this.initContainer();
      this.progressBar = null;
    }
    setModel(remoteVideo: any) {
      this.remoteVideo = remoteVideo;
      this.setTitle( remoteVideo.title );
      this.setVideoPlayer( remoteVideo.remote_video_url );
    }
    setTitle(title: string) {
      this.titleContainer.text(title);
    }
    updateProgressBar(value: number) {
      var _self:any;
      this.progressBar.progress({
        value: value,
        text: this.progressBarTextOptions
      });
    }
    setVideoPlayer(remoteVideoURL: string) {
      var _self = this;
      var videoPlayer = $('<video/>', { 'controls': true, 'width': "320",
        'height': "240", 'class': 'video-player'});
      videoPlayer.attr('src', remoteVideoURL);
      videoPlayer.hide();
      this.progressBarContainer.append( videoPlayer );
      if (this.progressBar == null) {
        videoPlayer.show();
      } else {
        this.progressBar.hide();
        videoPlayer.fadeIn();
      }
      if (this.remoteVideo.remote_id != null) this.initDestroyButton();
    }
    initDestroyButton(){
      var _self = this;
      var button = $('<div/>', {'class': 'ui basic large icon button'});
      var icon = $('<i/>', {'class': 'remove icon'});
      button.text('Remove');
      button.prepend(icon);
      this.actionsContainer.append(button);
      button.click( () => _self.remove() );
    }
    remove() {
      this.grid.removeRecord( this );
    }
    initProgressBar() {
      var bar = $('<div/>', {'class': 'bar'});
      var progress = $('<div/>', {'class': 'progress'});
      var label = $('<div/>', {'class': 'label'});
      var progressBarContainer = $('<div/>', { 'class': 'ui progress' });

      bar.append( progress );
      progressBarContainer.append( bar );
      progressBarContainer.append( label );
      this.progressBarContainer.append( progressBarContainer );
      this.progressBar = progressBarContainer.progress({
        label: false,
        total: 100,
        value: 0,
        text: this.progressBarTextOptions
      });
    }
    initContainer(){
      this.container = $('<tr/>');
      this.titleContainer = $('<td/>');
      this.progressBarContainer = $('<td/>');
      this.actionsContainer = $('<td/>');
      this.container.append(this.titleContainer);
      this.container.append(this.progressBarContainer);
      this.container.append(this.actionsContainer);
    }
  }
  export class PreviewVideo {
    container: any;
    videoPlayer: any;
    removeButton: any;
    fileTitle: any;
    form: AsyncVideos.Form;
    constructor(container:any, form:AsyncVideos.Form){
      this.container = container;
      this.form = form;
      this.initContainer();
    }
    setVideo(data:any){
      var file:File = data.files[0];
      var objectURL:string = URL.createObjectURL(file);
      this.fileTitle.text( file.name );
      this.videoPlayer.attr('src', objectURL);
      this.container.slideDown();
    }
    initContainer() {
      var _self = this;
      this.videoPlayer = this.container.find('.video video');
      this.fileTitle = this.container.find('.content .meta span');
      this.removeButton = this.container.find('.content .button');
      this.removeButton.click( () => _self.onRemove() );
      this.container.hide();
    }
    onRemove() {
      this.form.clearFileInput();
      this.form.fileData = null;
      this.container.slideUp();
    }
  }
  export class Form {
    container: any;
    fileData: any;
    record: Record;
    grid: Grid;
    previewVideo: PreviewVideo;
    keepPreviewURL: boolean;
    static id:number = 0;
    static acceptedFormats =
      /(\.|\/)(asf|avi|flv|m4v|mov|mp4|mp4a|m4a|3g2|mj2|wmv|mp3)$/i;
    constructor(container:any, grid: Grid) {
      this.container = container;
      this.grid = grid;
      this.fileData = null;
      this.keepPreviewURL = true;
      this.record = new Record(grid);
      this.initPreviewVideo();
      this.initFileUpload();
      this.initFormValidation();
    }
    // FIXME
    updateButton(){
      var currentId = ++Form.id;
      var identifier = 'models_remote_video_video' + currentId;
      var uploadButton = this.container.find('.upload-button');
      uploadButton.find('label').attr('for', identifier);
      uploadButton.find('input').attr('id', identifier);
    }
    clearFileInput(){
      this.container.find('.upload-button input').val('');
    }
    initPreviewVideo() {
      this.previewVideo = new PreviewVideo(this.container.find('.file-data'),
        this);
    }
    initFileUpload() {
      var _self: any = this;
      this.container.fileupload({
        dataType: 'json',
        add: (e:any, data:any) => {
          _self.processData(data);
        },
        progressall: (e:any, data:any) => {
          var progress = parseInt((data.loaded / data.total * 100).toString(),
            10);
          _self.record.updateProgressBar( progress );
        },
        done: (e: any, data:any) => {
          setTimeout(() => _self.receiveModel(data.result), 1000);
        }
      });
      this.container.submit((e:any) => _self.serializeForm(e));
    }
    receiveModel(remoteVideo:any){
      if ( this.keepPreviewURL ) {
        remoteVideo.original_url = remoteVideo.remote_video_url;
        remoteVideo.remote_video_url =
          this.previewVideo.videoPlayer.attr('src');
      }
      this.record.setModel(remoteVideo);
    }
    processData(data:any){
      var file:File = data.files[0];
      if (Form.acceptedFormats.test(file.type)) {
        this.fileData = data;
        this.previewVideo.setVideo( data );
      } else{
        $('#invalid-modal').modal('show');
      }
    }
    initFormValidation() {
      this.container
        .form({
          fields: {
            name: {
              identifier  : 'models_remote_video[title]',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter title'
                }
              ]
            },
            video: {
              identifier  : 'models_remote_video[video]',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please attach file'
                }
              ]
            }
          }
        });
    }
    serializeForm(e:any) {
      var _self:any = this;
      var data:any = null;
      var objects:Array<any> = null;
      e.preventDefault();
      if (this.fileData != null) {
        _self = this
        data = {};
        objects = this.container.serializeArray();
        objects.forEach((obj) => {
          data[obj.name] = obj.value;
        });
        this.fileData.formData = data;
        this.fileData.submit();
        this.record.setTitle( this.container.find('#video_title').val() );
        this.grid.appendRecord( this.record );
      }
    }
  }
}
