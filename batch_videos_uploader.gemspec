$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "batch_videos_uploader/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "batch_videos_uploader"
  s.version     = BatchVideosUploader::VERSION
  s.authors     = ["TODO: Your name"]
  s.email       = ["TODO: Your email"]
  s.homepage    = "TODO"
  s.summary     = "TODO: Summary of BatchVideosUploader."
  s.description = "TODO: Description of BatchVideosUploader."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 4.1.0"
  s.add_dependency "jquery-rails", "~> 3.1.1"
  s.add_dependency "typescript-rails", "~> 0.6.1"
  s.add_dependency "vzaar", "~> 1.5.3"

  s.add_development_dependency "sqlite3"
  s.add_development_dependency "pry-rails"
  s.add_development_dependency "pry-byebug"
  s.add_development_dependency "byebug"
end
