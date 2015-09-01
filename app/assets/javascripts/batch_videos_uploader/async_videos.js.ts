declare var $:Function;

module AsyncVideos {
  export class Grid {
    currentForm: AsyncVideos.Form;
    previousForm: AsyncVideos.Form;
    formContainer: any;
    container: any;
    constructor(formContainer: any, container: any) {
      this.formContainer = formContainer;
      this.container = container;
      this.initCurrentForm();
    }
    initCurrentForm() {
      this.currentForm = new AsyncVideos.Form(this.formContainer.find('form'),
        this);
    }
    appendRecord(record: Record){
      this.container.find('tbody').append( record.container );
      this.refreshForm();
      record.initProgressBar();
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
    progressBar: any;
    progressBarTextOptions: any;
    constructor() {
      this.progressBarTextOptions = {
        active: '{percent}% Uploaded',
        success: 'Video Uploaded'
      };
      this.initContainer();
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
      this.progressBar.fadeOut({
        complete: () => {
          videoPlayer.fadeIn();
        }
      });
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
      this.container.append(this.titleContainer);
      this.container.append(this.progressBarContainer);
    }
  }
  export class Form {
    container: any;
    fileData: any;
    record: Record;
    grid: Grid;
    static id:number = 0;
    constructor(container:any, grid: Grid) {
      this.container = container;
      this.grid = grid;
      this.fileData = null;
      this.record = new Record();
      this.initFileUpload();
    }
    // FIXME
    updateButton(){
      var currentId = ++Form.id;
      var identifier = 'video_video' + currentId;
      var uploadButton = this.container.find('.upload-button');
      uploadButton.find('label').attr('for', identifier);
      uploadButton.find('input').attr('id', identifier);
    }
    initUploadButton() {
      var videoButton = this.container.find('#video-upload-button');
      var input = videoButton.find('input');
      videoButton.click( () => input.click() );
    }
    initFileUpload() {
      var _self: any = this;
      this.container.fileupload({
        dataType: 'json',
        add: (e:any, data:any) => {
          _self.fileData = data;
        },
        progressall: (e:any, data:any) => {
          var progress = parseInt((data.loaded / data.total * 100).toString(),
            10);
          _self.record.updateProgressBar( progress );
        },
        done: (e: any, data:any) => {
          setTimeout(() => {
            _self.record.setVideoPlayer(data.result.remote_video_url);
          }, 1000);
        }
      });
      this.container.submit((e:any) => _self.serializeForm(e));
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
