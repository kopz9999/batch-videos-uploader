require_dependency "batch_videos_uploader/application_controller"

module BatchVideosUploader
  class RemoteVideosController < ApplicationController
    def index
      if BatchVideosUploader::Setting.instance.has_vzaar?
        @video = BatchVideosUploader::Models::RemoteVideo.new
      else
        render :message
      end
    end

  end
end
