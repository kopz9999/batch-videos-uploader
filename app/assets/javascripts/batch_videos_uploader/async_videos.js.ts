
module AsyncVideos {
  export class Grid {

  }
  export class Form {
    container: any;
    constructor(container:any) {
      this.container = container;
      this.initFileUpload();
    }
    initFileUpload() {
       this.container.fileupload({dataType: 'json'});
    }
  }
}
