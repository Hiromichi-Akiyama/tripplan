FactoryBot.define do
  factory :trip do
    title { Faker::Lorem.sentence }
    start_date { Faker::Date.forward(days: 10) }
    end_date { start_date + Faker::Number.between(from: 0, to: 10).days }
    association :user
  end
end
