BatchVideosUploader::Engine.routes.draw do
  resources :remote_videos
  namespace :api do
    resources :vzaar_videos
  end
  resources :videos
end
