module BatchVideosUploader
  module Models
    class VzaarFactory < VideosFactory
      include Singleton

      protected

      attr_accessor :vzaar_api

      public

      def retrieve
        self.vzaar_api.videos.map{|vci| self.parse_vzaar_item(vci) }
      end

      def destroy(remote_video_id)
        self.vzaar_api.delete_video remote_video_id
      end

      def create(remote_video)
        remote_video.id = SecureRandom.uuid
        self.parallel_upload remote_video
        remote_video
      end

      protected

      def parallel_upload(remote_video)
        Thread.new do
          begin
            result = self.vzaar_api.upload_video(path: remote_video.video.path,
              title: remote_video.title)
            remote_video.remote_id = result.doc.xpath('//video').text
            remote_video.remote_video_url = "http://view.vzaar.com"\
              "/#{remote_video.remote_id}/video"
            Rails.logger.info("Uploaded #{remote_video.title} to vzaar\n"\
              "#{remote_video.remote_video_url}")
          rescue => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
          end
        end
      end

      def initialize
        vzaar_hash = BatchVideosUploader::Setting.instance
          .configuration_hash[:vzaar]
        self.vzaar_api = Vzaar::Api.new(application_token: vzaar_hash[:token],
          login: vzaar_hash[:username])
      end

      def parse_vzaar_item(vci)
        remote_video = RemoteVideo.new
        remote_video.remote_id = vci.doc.xpath('//id').text
        remote_video.title = vci.doc.xpath('//title').text
        remote_video.remote_video_url = vci.doc.xpath('//url').text
        remote_video.thumb_url = vci.doc.xpath('//thumbnail_url').text
        remote_video
      end

    end
  end
end
