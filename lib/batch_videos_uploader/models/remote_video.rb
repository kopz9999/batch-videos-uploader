module BatchVideosUploader
  module Models
    class RemoteVideo
      include ActiveModel::Model
      include ActiveModel::Serializers::JSON
      attr_accessor :id, :remote_id, :remote_video_url, :thumb_url, :title,
        :video

      def attributes
        { id: self.id, remote_id: self.remote_id,
          remote_video_url: self.remote_video_url, title: self.title }
      end

    end
  end
end
