FactoryBot.define do
  factory :packing_item do
    name { Faker::Lorem.word }
    association :trip
  end
end
