BatchVideosUploader::Engine.routes.draw do
  resources :remote_videos, only: [ :index ]
  namespace :api do
    resources :vzaar_videos, only: [ :index, :create, :destroy ] do
      post :sync, on: :collection
    end
  end
end
