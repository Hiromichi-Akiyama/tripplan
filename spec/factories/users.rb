FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password do
      letters = Faker::Alphanumeric.alpha(number: 10)
      digits = Faker::Number.number(digits: 2).to_s
      (letters + digits).chars.shuffle.join
    end
    password_confirmation { password }
  end
end
