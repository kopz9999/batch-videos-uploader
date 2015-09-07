require_dependency "batch_videos_uploader/application_controller"

module BatchVideosUploader
  class Api::VzaarVideosController < ApplicationController
    def index
      render json: VzaarUpload::Factory.instance.retrieve
    end

    def create
      remote_video = VzaarUpload::Factory.instance
        .create Models::RemoteVideo.new(video_params)
      render json: remote_video, status: :created
    end

    def destroy
      VzaarUpload::Factory.instance.destroy params[:id]
      render nothing: true, status: :no_content
    end

    def sync
      sync_videos = VzaarUpload::Factory.instance.sync
      render json: sync_videos
    end

    private

    def video_params
      params.require(:models_remote_video).permit(:video, :title)
    end

  end
end
