require 'jquery-rails'
require "batch_videos_uploader/engine"
require "batch_videos_uploader/railtie"
require "batch_videos_uploader/setting"
require "batch_videos_uploader/models"

module BatchVideosUploader
  def self.absolute_path
    File.dirname __dir__
  end
end
