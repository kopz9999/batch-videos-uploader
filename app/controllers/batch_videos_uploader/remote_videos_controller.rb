require_dependency "batch_videos_uploader/application_controller"

module BatchVideosUploader
  class RemoteVideosController < ApplicationController
    def index
      @video = Video.new
    end

    def create
      @video = Video.new(video_params)
      @video.save
      render json: @video
    end

    private

    def video_params
      params.require(:video).permit(:video, :title)
    end


  end
end
