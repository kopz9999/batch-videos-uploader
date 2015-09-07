module BatchVideosUploader
  module Models
    class VideosFactory

      def retrieve
        raise NotImplementedError
      end

      def destroy( remote_video_id )
        raise NotImplementedError
      end

      def create( remote_video )
        raise NotImplementedError
      end

    end
  end
end
