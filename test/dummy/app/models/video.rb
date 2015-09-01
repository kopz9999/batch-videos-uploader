class Video < ActiveRecord::Base
  dragonfly_accessor :video

  validates :video, presence: true
  #validates_size_of :image, maximum: 500.kilobytes,
  #                  message: "should be no more than 500 KB", if: :image_changed?

  #validates_property :format, of: :image, in: [:jpeg, :jpg, :png, :bmp], case_sensitive: false,
  #                   message: "should be either .jpeg, .jpg, .png, .bmp", if: :image_changed?

  def remote_video_url
    self.video.remote_url
  end

end
