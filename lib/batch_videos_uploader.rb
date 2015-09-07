require 'jquery-rails'
require "batch_videos_uploader/engine"
require "batch_videos_uploader/railtie"
require "batch_videos_uploader/setting"
require "batch_videos_uploader/models"
require "batch_videos_uploader/vzaar_upload"

module BatchVideosUploader
  def self.absolute_path
    File.dirname __dir__
  end
end
