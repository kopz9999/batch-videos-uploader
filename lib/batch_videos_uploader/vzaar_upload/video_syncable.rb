module BatchVideosUploader
  module VzaarUpload
    module VideoSyncable

      # Receive a file from Vzaar API
      # @param [String] title
      # @param [File] file
      # @return [nil]
      def process_remote_video( title, file )
        raise NotImplementedError
      end

    end
  end
end
