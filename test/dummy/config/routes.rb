Rails.application.routes.draw do

  mount BatchVideosUploader::Engine => "/batch_videos_uploader"
end
