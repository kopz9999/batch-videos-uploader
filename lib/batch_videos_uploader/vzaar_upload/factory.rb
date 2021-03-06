module BatchVideosUploader
  module VzaarUpload
    class Factory < Models::VideosFactory
      include Singleton

      protected

      attr_accessor :vzaar_api

      public

      def can_sync?
        !self.sync_class.blank?
      end

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

      def sync
        results = []
        self.retrieve.each do |remote_video|
          object = self.sync_class.new
          remote_video.download
          object.process_remote_video remote_video
          results << object
        end
        results
      end

      protected

      def vzaar_settings
        @vzaar_settings ||= BatchVideosUploader::Setting.instance
          .configuration_hash[:vzaar]
      end

      def sync_class
        @sync_class ||= self.load_sync_class
      end

      def load_sync_class
        if BatchVideosUploader::Setting.instance.has_vzaar?
          sync_model_str = self.vzaar_settings[:sync_model]
          unless sync_model_str.blank?
            sync_model_str.constantize
          else
            nil
          end
        else
          nil
        end
      end

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
        remote_video = Models::RemoteVideo.new
        remote_video.remote_id = vci.doc.xpath('//id').text
        remote_video.title = vci.doc.xpath('//title').text
        remote_video.remote_video_url = vci.doc.xpath('//url').text
        remote_video.thumb_url = vci.doc.xpath('//thumbnail_url').text
        remote_video
      end

    end
  end
end
