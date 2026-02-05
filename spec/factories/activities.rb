FactoryBot.define do
  factory :activity do
    title { Faker::Lorem.sentence }
    association :trip
    date { trip.start_date }
  end
end
