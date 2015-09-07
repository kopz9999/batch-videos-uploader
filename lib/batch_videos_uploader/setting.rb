module BatchVideosUploader
  class Setting < Rails::Railtie
    include Singleton

    attr_accessor :configuration_hash

    def load_settings
      if File.exist? self.default_configuration_path
        self.configuration_hash =
          YAML.load_file(self.default_configuration_path)
        self.configuration_hash.deep_symbolize_keys!
        self.check_configuration
        return true
      else
        self.configuration_hash = nil
        unless Rails.env.test?
          Rails.logger.warn "No configuration provided for Batch Videos"
        end
        return false
      end
    end

    protected

    def check_configuration
      if self.configuration_hash[:vzaar].blank?
        Rails.logger.warn "No configuration provided for vzaar"
      end
    end

    def default_configuration_path
      "#{Rails.root.to_s}/config/batch_videos.yml"
    end

  end
end
