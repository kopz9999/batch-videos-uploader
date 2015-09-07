# Batch Videos Uploader

Rails Engine that adds a set of views to upload videos by batch to a
[vzaar](vzaar.com) account. It also provides synchronization with local
database.

## Installation

In order to install this gem in your Rails project, you must add the following
gems to your Gemfile:

```ruby
gem 'semantic-ui-sass', github: 'doabit/semantic-ui-sass'
gem 'jquery-fileupload-rails', github: 'Springest/jquery-fileupload-rails'
gem 'batch_videos_uploader', github: 'kopz9999/batch-videos-uploader'
```

### NOTE

This project depends on **rails 4.1.0**

## Usage

Mount the routes:
```ruby
Rails.application.routes.draw do
  mount BatchVideosUploader::Engine => "/batch_videos_uploader"
end
```

Locate file with configuration file named **batch_videos.yml** under config:

```yaml
# your_app/config/batch_videos.yml
vzaar:
  username: 'vzaar login username'
  token: 'api token' # Create one in https://app.vzaar.com/settings/api
  sync_model: 'Video' # OPTIONAL: Class to sync videos against another source
```

Restart your server and go to:
http://localhost:3000/batch_videos_uploader/remote_videos

You should be able to see the following screen:

![GitHub Logo](https://s3-us-west-2.amazonaws.com/kopz-projects/CodersClan/Async+Uploader/Snip20150907_2.png)

In this point you can start uploading videos to your vzaar account
simultaneously.

### Synchronization with other sources

As mentioned in the comments above, you can provide a configuration key called
**sync_model**, which should be a class in your application (usually an
ActiveRecord model). If your provided this key, you should see the following
button:

![GitHub Logo](https://s3-us-west-2.amazonaws.com/kopz-projects/CodersClan/Async+Uploader/Snip20150907_3.png)

The class should implement the following module:
- **BatchVideosUploader::VzaarUpload::VideoSyncable**

Check the following example:

```ruby
class Video < ActiveRecord::Base
  include BatchVideosUploader::VzaarUpload::VideoSyncable

  dragonfly_accessor :video

  validates :video, presence: true

  def remote_video_url
    self.video.remote_url
  end

  # Method to override
  def process_remote_video( remote_video )
    self.video = remote_video.file_stream
    self.title = remote_video.title
    self.save
  end

end
```

In this example the local class Video, implements VideoSyncable module.
The method process_remote_video receives an object of class
**BatchVideosUploader::Models::RemoteVideo**. This class has the following
attributes:
```ruby
# @attr [Integer] vzaar id
attr_accessor :remote_id
# @attr [String] vzaar preview url
attr_accessor :remote_video_url
# @attr [String] vzaar video title
attr_accessor :title
# @attr [File] video file
attr_accessor :file_stream
```

The sample class uses [dragonfly](https://github.com/markevans/dragonfly)
in order to save files locally. In this example video receives vzaar file_stream
and saves it locally.
You can modify this behaviour and sync the videos in the way you prefer.
To see the example in action, download the repo and run the dummy application.

### NOTE

If you did not provide a configuration file you should see a page with a
message:

**No vzaar settings provided. Provide configuration and restart server**

## Testing

To run tests with mini-test:

```bash
$ rake test
```

## TODO

- Right now this project only supports vzaar, it can support other apis.
- Migrate tests to RSpec

## License

Code released under [the MIT license](LICENSE.txt).
