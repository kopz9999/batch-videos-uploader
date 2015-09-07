declare var $:any;

module AsyncVideos {
  export class Sync {
    button: any;
    apiEndpoint: string;
    constructor(button: any, apiEndpoint: string) {
      this.button = button;
      this.apiEndpoint = apiEndpoint;
      this.initContainer();
    }
    loading() {
      this.button.addClass('loading');
    }
    loaded() {
      this.button.removeClass('loading');
    }
    initContainer() {
      var _self = this;
      this.button.click( ()=> _self.doRequest() );
    }
    doRequest() {
      this.loading();
      $.ajax({
        url: this.apiEndpoint,
        success: this.onSuccess,
        complete: this.loaded,
        context: this,
        type: 'POST'
      });
    }
    onSuccess() {
      $('#sync-success').modal('show');
    }
  }
}
