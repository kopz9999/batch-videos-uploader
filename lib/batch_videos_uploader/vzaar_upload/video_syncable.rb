module BatchVideosUploader
  module VzaarUpload
    module VideoSyncable

      # Receive a file from Vzaar API
      # @param [BatchVideosUploader::Models::RemoteVideo] remote_video
      # @return [nil]
      def process_remote_video( remote_video )
        raise NotImplementedError
      end

    end
  end
end
