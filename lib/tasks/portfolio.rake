namespace :portfolio do
  desc "Reset portfolio seed data for the fixed test user"
  task reset: :environment do
    if Rails.env.production? && ENV["ALLOW_PORTFOLIO_RESET"] != "1"
      warn "ALLOW_PORTFOLIO_RESET=1 が必要です（production実行を防止するため）"
      exit 1
    end

    require Rails.root.join("lib/portfolio/seed")

    Portfolio::Seed.reset!
    puts "Portfolio data reset completed."
  end
end
