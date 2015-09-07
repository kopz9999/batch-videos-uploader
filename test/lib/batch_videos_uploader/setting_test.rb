require 'test_helper'

module BatchVideosUploader
  class SettingTest < ActiveSupport::TestCase
    class LoadSettingsTests < ActiveSupport::TestCase
      test 'with invalid path' do
        obj = BatchVideosUploader::Setting.instance
        obj.stub :default_configuration_path, '/fake_path' do
          refute obj.load_settings
          assert_nil obj.configuration_hash
        end
      end
      test 'with valid path' do
        path = "#{BatchVideosUploader.absolute_path}"\
          "/test/fixtures/batch_videos.yml"
        obj = BatchVideosUploader::Setting.instance
        obj.stub :default_configuration_path, path do
          assert obj.load_settings
          refute_nil obj.configuration_hash[:vzaar]
          assert_equal obj.configuration_hash[:vzaar][:username], 'test'
        end
      end

      teardown do
        path = "#{BatchVideosUploader.absolute_path}"\
          "/test/dummy/config/batch_videos.yml"
        obj = BatchVideosUploader::Setting.instance
        obj.stub :default_configuration_path, path do
          obj.load_settings
        end
      end
    end
  end
end
