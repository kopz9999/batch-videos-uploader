require 'test_helper'

module BatchVideosUploader
  module VzaarUpload
    class FactoryTest < ActiveSupport::TestCase
      class CreateTests < ActiveSupport::TestCase
        def sample_file
          path = "#{BatchVideosUploader.absolute_path}/test/fixtures/sample.mp4"
          type = Mime::Type.lookup_by_extension('mp4')
          Rack::Test::UploadedFile.new(path, type)
        end

        def remote_video
          BatchVideosUploader::Models::RemoteVideo.new video: sample_file,
            title: 'test kings'
        end

        def factory
          BatchVideosUploader::VzaarUpload::Factory.instance
        end

        test 'uploads file' do
          obj = factory.create remote_video
          refute_nil obj.id
          assert_nil obj.remote_video_url
          refute_includes obj.as_json.keys, :video
        end

      end
      class SyncTests < ActiveSupport::TestCase

        def factory
          BatchVideosUploader::VzaarUpload::Factory.instance
        end

        test 'synchronizes videos' do
          objects = factory.sync
          refute_nil objects
        end

      end
    end
  end
end
