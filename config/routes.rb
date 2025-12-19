Rails.application.routes.draw do
  devise_for :users

  resources :trips, only: %i[index show new create edit update destroy]
  # 将来的にonlyは外す予定
end
