require_dependency "batch_videos_uploader/application_controller"

module BatchVideosUploader
  class RemoteVideosController < ApplicationController
    def index
      @video = BatchVideosUploader::Models::RemoteVideo.new
    end

  end
end
