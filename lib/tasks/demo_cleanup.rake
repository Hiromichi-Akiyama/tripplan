namespace :demo do
  desc "Clean up expired demo users"
  task cleanup: :environment do
    deleted = 0
    failed = 0
    started_at = Time.current

    Rails.logger.info("Demo cleanup started at #{started_at}")
    puts "Demo cleanup started at #{started_at}"

    User.expired_demos.find_each(batch_size: 100) do |user|
      begin
        user.destroy!
        deleted += 1
      rescue StandardError => e
        failed += 1
        Rails.logger.error("Demo cleanup failed for user #{user.id}: #{e.class} #{e.message}")
        puts "Demo cleanup failed for user #{user.id}: #{e.class} #{e.message}"
      end
    end

    finished_at = Time.current
    Rails.logger.info("Demo cleanup finished at #{finished_at}. deleted=#{deleted} failed=#{failed}")
    puts "Demo cleanup finished at #{finished_at}. deleted=#{deleted} failed=#{failed}"
  end
end
