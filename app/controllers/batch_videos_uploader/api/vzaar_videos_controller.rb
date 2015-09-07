require_dependency "batch_videos_uploader/application_controller"

module BatchVideosUploader
  class Api::VzaarVideosController < ApplicationController
    def index
      render json: BatchVideosUploader::Models::VzaarFactory.instance.retrieve
    end

    def create
      remote_video = Models::VzaarFactory.instance
        .create Models::RemoteVideo.new(video_params)
      render json: remote_video
    end

    def destroy
      BatchVideosUploader::Models::VzaarFactory.instance.destroy params[:id]
      render nothing: true, status: :no_content
    end

    private

    def video_params
      params.require(:video).permit(:video, :title)
    end

  end
end
