module BatchVideosUploader
  class Railtie < Rails::Railtie
    initializer "batch_videos_uploader.railtie.load_settings" do
      Setting.instance.load_settings
    end
  end
end
