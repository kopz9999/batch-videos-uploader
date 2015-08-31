Rails.application.routes.draw do
  root to: 'home#index'
  mount BatchVideosUploader::Engine => "/batch_videos_uploader"
end
